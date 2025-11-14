import { useState, useEffect } from 'react';
import './App.css'
import AddRecord from './components/AddRecord';
import RecordList from './components/RecordList';


const API_URL = "http://25.61.210.232:8000/api/rest/v2/pipeline/";

const TOKEN =
  "350a09095fdcb7731b7c26145c0ada3edc026b4e865ff8c0004c95b60cb802c99a1031c3de4a6a394a963aa5c592ff74feb5e76186cfdc995b4a91ede9c5b9e0";



// ✅ Простая и самодостаточная функция запроса
async function fetchData(setData) {
  try {
    //запрос на сервер
    const res = await fetch(`${API_URL}?order_by=id`, {
      headers: {
        Authorization: `Token ${TOKEN}`,
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
      const mockRes = await fetch('/mock.json'); //Запрос в public для mock
      if (!mockRes.ok) throw new Error('Ошибка загрузки mock.json');
      const mockData = await mockRes.json(); //Записб mock в БД
      setData(mockData);
    } catch (mockErr) {
      console.error('Ошибка загрузки mock из public:', mockErr); //Такое собитие не возможно пока mock хранится в репозке
      setData(null); // или как-то иначе обработать ошибку
    }
  }
}


export default function App() {
  const [data, setData] = useState(); // Основная для БД
  const [loading, setLoading] = useState(true); // Для визуалки загрузки 
  const [editId, setEditId] = useState(null); // Для изменений
  const [status, setStatus] = useState(""); // 🔹 для сообщений (успех/ошибка)

  // Для того чтоб один раз запросить при рендере (может двоить из-за strik-мода в реакте, на проде должно бьіть все ок)
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchData(setData);
      setLoading(false);
    })();
  }, []);

  //Удаление записи 
  const handleDelete = async (id) => {
    try {
      setStatus("Удаление...");

      //Отправка запроса на удаление на сервер
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${TOKEN}` },
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
        className="bg-amber-700 text-white h-[50px] w-[150px] rounded-md hover:bg-amber-800 transition"
        onClick={() => fetchData(setData)}>Refresh</button>
      {status && <span className="text-sm text-gray-600">{status}</span>}

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
          (<span className="text-gray-500">Загрузка...</span>) : 
          (<RecordList
            data={data}
            editId={editId}
            setEditId={setEditId}
            setData={setData}
            handleDelete={handleDelete}
          />)}
      </div>
    </div>
  );
}