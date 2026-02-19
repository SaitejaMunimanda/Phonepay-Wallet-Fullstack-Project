import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const upiId = localStorage.getItem("upiId");
    const name = localStorage.getItem("name");

    const [balance, setBalance] = useState(0);
    const [receiverUpi, setReceiverUpi] = useState("");
    const [amount, setAmount] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [addAmount, setAddAmount] = useState("");
    
    // History state
    const [showHistory, setShowHistory] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    useEffect(() => {
        if (!upiId) {
            navigate("/login");
            return;
        }
        loadBalance();
    }, [upiId, navigate]);

    const loadBalance = async () => {
        const res = await api.get(`/wallet/${upiId}`);
        setBalance(res.data.data.balance);
    };

    /* ADD MONEY */
    const confirmAddMoney = async () => {
        if (!addAmount || addAmount <= 0) {
            alert("Enter valid amount");
            return;
        }

        await api.post("/wallet/add", {
            upiId: upiId,
            amount: addAmount
        });

        setShowModal(false);
        setAddAmount("");
        loadBalance();
    };

    /* SEND MONEY */
    const sendMoney = async () => {
        if (!receiverUpi || !amount) {
            alert("Enter all details");
            return;
        }

        try {
            await api.post("/transaction/send", {
                senderUpi: upiId,
                receiverUpi: receiverUpi,
                amount: amount
            });

            alert("Money sent successfully");
            setReceiverUpi("");
            setAmount("");
            loadBalance();
        } catch (err) {
            alert(err.response?.data?.message || "Transaction failed");
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    /* LOAD TRANSACTION HISTORY */
    const loadTransactionHistory = async () => {
        try {
            const res = await api.get(`/transaction/history/${upiId}`);
            setTransactions(res.data.data || []);
            setShowHistory(!showHistory);
            setHistoryLoaded(true);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to load history");
        }
    };

    return (
        <div className="dashboard">

            {/* HEADER */}
            <div className="navbar">
                <div>
                    <div className="logo">MRU Pay</div>
                    <div className="subtitle">Malla Reddy University</div>
                </div>

                <div className="nav-right">
                    <span>Welcome, {name}</span>
                    <button className="logout" onClick={logout}>Logout</button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="container">
                <div className="dashboard-layout">
                    
                    {/* LEFT SECTION */}
                    <div className="left-section">
                        {/* WALLET */}
                        <div className="balance-card">
                            <h3>Wallet Balance</h3>
                            <div className="balance">₹{balance.toFixed(2)}</div>
                            <div className="wallet-actions">
                                <button className="add-btn" onClick={() => setShowModal(true)}>
                                    Add Money
                                </button>
                                <button className="history-btn" onClick={loadTransactionHistory}>
                                    Transaction History
                                </button>
                            </div>
                        </div>

                        {/* SEND MONEY */}
                        <div className="send-card">
                            <h3>Send Money</h3>

                            <label>Recipient UPI ID</label>
                            <input
                                placeholder="Enter UPI ID"
                                value={receiverUpi}
                                onChange={e => setReceiverUpi(e.target.value)}
                            />

                            <label>Amount (₹)</label>
                            <input
                                placeholder="Enter amount"
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />

                            <button className="send-btn" onClick={sendMoney}>
                                Send Money
                            </button>
                        </div>
                    </div>

                    {/* RIGHT SECTION - TRANSACTION HISTORY */}
                    {showHistory && historyLoaded && (
                        <div className="right-section">
                            <div className="history-section">
                                <div className="history-title">
                                    <h3>📊 Transaction History</h3>
                                    <button className="hide-btn" onClick={loadTransactionHistory}>Hide</button>
                                </div>
                                
                                {transactions.length === 0 ? (
                                    <div className="no-transactions">
                                        <p>No transactions yet</p>
                                    </div>
                                ) : (
                                    <div className="transactions-container">
                                        {transactions.map((txn, index) => {
                                            const isSent = txn.senderUpi === upiId;
                                            const type = isSent ? 'debited' : 'credited';
                                            
                                            return (
                                                <div key={index} className={`txn-card ${type}`}>
                                                    <div className="txn-icon">
                                                        {isSent ? '📤' : '📥'}
                                                    </div>
                                                    <div className="txn-details">
                                                        <div className="txn-flow-info">
                                                            <span className="label">FROM</span>
                                                            <span className="value">{txn.senderUpi}</span>
                                                        </div>
                                                        <div className="txn-arrow">→</div>
                                                        <div className="txn-flow-info">
                                                            <span className="label">TO</span>
                                                            <span className="value">{txn.receiverUpi}</span>
                                                        </div>
                                                    </div>
                                                    <div className="txn-info-right">
                                                        <div className={`txn-amt ${type}`}>
                                                            {isSent ? '-' : '+'} ₹{txn.amount.toFixed(2)}
                                                        </div>
                                                        <div className={`txn-type-badge ${type}`}>
                                                            {isSent ? 'Debited' : 'Credited'}
                                                        </div>
                                                        <div className="txn-time">
                                                            {new Date(txn.timestamp).toLocaleDateString()} {new Date(txn.timestamp).toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ADD MONEY MODAL */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Enter amount to add</h3>
                        <input
                            type="number"
                            value={addAmount}
                            onChange={e => setAddAmount(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="ok-btn" onClick={confirmAddMoney}>OK</button>
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );


}

export default Dashboard;
