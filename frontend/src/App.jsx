import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/api/transactions";

function App() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // get a la api para recuperar transacciones al cargar
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("No se pudieron recuperar las transacciones.");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchTransactions();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    // validar
    const numAmount = Number(amount);

    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      setError("Ingresá un monto mayor que cero");
      return;
    }

    if (!description.trim()) {
      setError("Ingresá una descripción");
      return;
    }

    setLoading(true);

    // crear y guardar la transaccion
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numAmount,
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear la transacción.");
      }

      setTransactions((previousTransactions) => [
        data,
        ...previousTransactions,
      ]);

      setAmount("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <section className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Monto</label>

            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>

            <input
              id="description"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Registrar transacción"}
          </button>
        </form>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <section className="transactions">
          <h2>Transacciones registradas</h2>

          {transactions.length === 0 ? (
            <p className="empty">Todavía no hay transacciones.</p>
          ) : (
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id} className="transaction">
                  <div>
                    <strong>{transaction.description}</strong>
                  </div>

                  <span className="amount">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(transaction.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
