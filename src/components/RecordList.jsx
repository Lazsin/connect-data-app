import EditRecord from "./EditRecord";

export default function RecordList({ data, editId, setEditId, setData, handleDelete }) {
  return (
    <div className="flex-1 justify-center">
      <div>
        <p>Всего записей: {data.count}</p>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.results?.map((item) => (
          <li
            key={item.id}
            className="p-3 bg-gray-200 rounded-lg shadow-sm flex flex-col justify-center"
          >
            {editId === item.id ? (
              <EditRecord
                item={item}
                onSave={(updated) => {
                  setData((prev) => ({
                    ...prev,
                    results: prev.results.map((r) =>
                      r.id === updated.id ? updated : r
                    ),
                  }));
                  setEditId(null);
                }}
                onCancel={() => setEditId(null)}
              />
            ) : (
              <div className="grid w-auto">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Read only:</strong> {item.read_only ? "✅" : "❌"}</p>
                <p><strong>Supported contact:</strong> {item.supported_contact ? "✅" : "❌"}</p>
                <p><strong>Supported child:</strong> {item.supported_child ? "✅" : "❌"}</p>
                <div className="flex gap-2 mt-3 justify-center">
                  <button
                    onClick={() => setEditId(item.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                     Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                     Удалить
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
