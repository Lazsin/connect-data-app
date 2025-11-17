import { useState } from "react";
import { API } from "./API/api";

export default function EditRecord({ item, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: item.name,
    read_only: item.read_only,
    supported_contact: item.supported_contact,
    supported_child: item.supported_child,
  });
  const [ loading, setLoading ] = useState();
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setStatus("Сохранение...");

    try {
      const res = await fetch(`${API.URL}${item.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${API.TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Ошибка PATCH: ${res.status}`);

      const updated = await res.json();
      onSave(updated);
      setStatus("✅ Сохранено!");
    } catch (err) {
      console.error("❌ Ошибка:", err);
      setStatus("⚠️ Ошибка сети — обновлено локально");

      // fallback — обновим локально
      onSave({ ...item, ...form });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="p-3 bg-gray-50 rounded-lg shadow-inner flex flex-col gap-2">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border p-1 rounded"
        disabled={loading}
      />
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          name="read_only"
          checked={form.read_only}
          onChange={handleChange}
        />
        Read only
      </label>
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          name="supported_contact"
          checked={form.supported_contact}
          onChange={handleChange}
        />
        Supported contact
      </label>
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          name="supported_child"
          checked={form.supported_child}
          onChange={handleChange}
        />
        Supported child
      </label>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
           Сохранить
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
        >
          Отмена
        </button>
      </div>

      {status && <p className="text-sm text-gray-500">{status}</p>}
    </div>
  );
}
