import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <main className="flex justify-center items-center h-screen">
        <button
          className="border-4 bg-gray-200 p-6 text-xl rounded-xl shadow"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </main>
    </>
  );
}

export default App;
