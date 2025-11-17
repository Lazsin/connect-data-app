import { useState } from "react";
import EditRecord from "./EditRecord";

export default function RecordList({ data, editId, setEditId, setData, handleDelete }) {
  const [deletingId, setDeletingId] = useState(null);
  
  return (
    <div className="flex-1">
      <p className="mb-3 font-semibold">Всего записей: {data.count} </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-300">
              <th className="border p-2">Name</th>
              <th className="border p-2">Read only</th>
              <th className="border p-2">Supported contact</th>
              <th className="border p-2">Supported child</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.results?.map((item) => (
              <tr key={item.id} className="bg-white">
                {editId === item.id ? (
                  // Режим редактирования занимает всю строку
                  <td colSpan="5" className="border p-3 bg-gray-100">
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
                  </td>
                ) : (
                  <>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2 text-center">
                      {item.read_only ? "✅" : "❌"}
                    </td>
                    <td className="border p-2 text-center">
                      {item.supported_contact ? "✅" : "❌"}
                    </td>
                    <td className="border p-2 text-center">
                      {item.supported_child ? "✅" : "❌"}
                    </td>
                    <td className="border p-2 text-center flex justify-center">
                      <button
                        onClick={() => setEditId(item.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                      >
                        Изменить
                      </button>

                      <button
                        onClick={async () => {
                          setDeletingId(item.id);
                          await handleDelete(item.id);
                          setDeletingId(null);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? (
                          <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          "Удалить"
                        )}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
