import { useState } from "react";

const API_URL = "http://25.61.210.232:8000/api/rest/v2/pipeline/";
const TOKEN =
  "350a09095fdcb7731b7c26145c0ada3edc026b4e865ff8c0004c95b60cb802c99a1031c3de4a6a394a963aa5c592ff74feb5e76186cfdc995b4a91ede9c5b9e0";

export default function AddRecord({ onAdd }) {
  const [name, setName] = useState("");
  const [read_only, setReadOnly] = useState(false);
  const [supported_contact, setSupportedContact] = useState(false);
  const [supported_child, setSupportedChild] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setStatus("Добавление...");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Token ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          read_only,
          supported_contact,
          supported_child,
        }),
      });

      if (!res.ok) throw new Error(`Ошибка POST: ${res.status}`);

      const newItem = await res.json();
      onAdd(newItem); // обновляем родительский список
      setName("");
      setReadOnly(false);
      setSupportedContact(false);
      setSupportedChild(false);
      setStatus("✅ Добавлено!");
    } catch (err) {
      console.error("❌ Ошибка добавления:", err);
      setStatus("⚠️ Ошибка сети — добавлено локально");

      // fallback (если сервер не доступен)
      const fakeItem = {
        id: Date.now(),
        name,
        read_only,
        supported_contact,
        supported_child,
      };
      onAdd(fakeItem);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 items-center mb-6 bg-gray-100 p-4 rounded-xl shadow"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Введите имя"
        className="border p-2 rounded w-full md:w-[250px]"
        disabled={loading}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={read_only}
          onChange={(e) => setReadOnly(e.target.checked)}
          disabled={loading}
        />
        Read only
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={supported_contact}
          onChange={(e) => setSupportedContact(e.target.checked)}
          disabled={loading}
        />
        Supported contact
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={supported_child}
          onChange={(e) => setSupportedChild(e.target.checked)}
          disabled={loading}
        />
        Supported child
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Добавляется..." : "Добавить"}
      </button>

      {status && <span className="text-sm text-gray-600">{status}</span>}
    </form>
  );
}
