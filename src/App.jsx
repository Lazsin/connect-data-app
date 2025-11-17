import { useState, useEffect } from 'react';
import './App.css'
import AddRecord from './components/AddRecord';
import RecordList from './components/RecordList';
import { API } from './components/API/api';
import LoaderOverlay from './components/LoaderOverlay'
import Pagination from './components/Pagination';



// ✅ Простая и самодостаточная функция запроса
async function fetchData(setData, setLoading, page, pageSize) {
  setLoading(true)
  try {
    //запрос на сервер
    const res = await fetch(`${API.URL}?order_by=id&page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: `Token ${API.TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    //Проверка статуса ответа и вивод при ошибке
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

    //Запись БД на локалку
    const data = await res.json();
    setData(data);
  } catch (err) {
    console.error("Ошибка запроса API, загружаем mock:", err);

    // fallback: загрузка БД из mock
     try {
      const mockRes = await fetch("/mock.json");
      const mock = await mockRes.json();

      const total = mock.results.length;

      // --- РУЧНАЯ ПАГИНАЦИЯ ДЛЯ MOCK ---
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      const paginated = {
        count: total,
        results: mock.results.slice(start, end),
      };

      setData(paginated);
    } catch (mockErr) {
      console.error("Ошибка mock:", mockErr);
      setData(null);
    }
  }
  setLoading(false)
}


export default function App() {
  const [data, setData] = useState(); // Основная для БД
  const [loading, setLoading] = useState(true); // Для визуалки загрузки 
  const [editId, setEditId] = useState(null); // Для изменений
  const [status, setStatus] = useState(""); // 🔹 для сообщений (успех/ошибка)
  const [page, setPage]=useState(1);//Страница (кол-фо)
  const [pageSize, setPageSize]=useState(5);//Об'ектов на странице (кол-во)


  // Для того чтоб один раз запросить при рендере (может двоить из-за strik-мода в реакте, на проде должно бьіть все ок)
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchData(setData, setLoading, page, pageSize);
      setLoading(false);
    })();
  }, [page, pageSize]);

  //Удаление записи 
  const handleDelete = async (id) => {
    try {
      setStatus("Удаление...");

      //Отправка запроса на удаление на сервер
      const res = await fetch(`${API.URL}${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${API.TOKEN} `},
      });


      //Если значение ответа сервера отрицательное записивается ошибка от сервера
      if (!res.ok) throw new Error(`Ошибка удаления: ${res.status}`);

      //Перезапись БД после удаления
      setData((prev) => ({
        ...prev,
        results: prev.results.filter((item) => item.id !== id),
        count: prev.count - 1,
      }));
      setStatus("✅ Успешно удалено");
    } 
    //Отслеживание ошибки
    catch (err) {
      console.error("❌ Ошибка при удалении:", err);
      setStatus("⚠️ Ошибка удаления, удалено локально");
      // fallback — локальное удаление (Не отправляет на сервер, даже если сервер подключился позже)
      setData((prev) => ({
        ...prev,
        results: prev.results.filter((item) => item.id !== id),
        count: prev.count - 1,
      }));
    }
  };


  return (
    <div className="flex-1 m-4">
      
      {/* Кнопка для перезапроса/обновления/синхронизации с сервером */}
      <button 
        className="bg-amber-700 text-white h-[50px] m-5 w-[150px] rounded-md hover:bg-amber-800 transition"
        onClick={() => fetchData(setData, setLoading, page, pageSize)}>Refresh</button>
      {status && <p className="text-sm m-2 text-gray-600">{status}</p>}

    {/* Добавление новой записи */}
    <AddRecord
      onAdd={(newItem) =>
        setData((prev) => ({
          ...prev,
          results: [newItem, ...prev.results],
          count: prev.count + 1,
        }))
      }
    />

      {/* Вьівод data.result в виде списка */}
      <div className="m-4 text-lg">
        {loading ? 
          (<LoaderOverlay/>) : 
          (<>
          
          <Pagination
            page={page}
            setPage={setPage}
            totalCount={data?.count || 0}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
          <RecordList
            data={data}
            editId={editId}
            setEditId={setEditId}
            setData={setData}
            handleDelete={handleDelete}/>
          
          </>
          )}
      </div>
    </div>
  );
}