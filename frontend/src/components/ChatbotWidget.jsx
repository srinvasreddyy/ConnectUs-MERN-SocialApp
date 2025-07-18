import React, { useReducer } from "react";
import { axiosInstance } from "../lib/axios.js";

const initialState = {
  open: false,
  messages: [{ from: "bot", text: "Hi! I'm ConnectUsBot. How can I help you today?" }],
  input: "",
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_OPEN":
      return { ...state, open: !state.open };
    case "CLOSE":
      return { ...state, open: false };
    case "SET_INPUT":
      return { ...state, input: action.value };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "RESET_INPUT":
      return { ...state, input: "" };
    default:
      return state;
  }
}

const ChatbotWidget = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { open, messages, input, loading } = state;

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // push user message
    dispatch({ type: "ADD_MESSAGE", message: { from: "user", text: trimmed } });
    dispatch({ type: "SET_LOADING", value: true });

    try {
      const res = await axiosInstance.post("/chatbot/ask", { message: trimmed });
      dispatch({ type: "ADD_MESSAGE", message: { from: "bot", text: res.data.reply } });
    } catch {
      dispatch({ type: "ADD_MESSAGE", message: { from: "bot", text: "Sorry, something went wrong." } });
    } finally {
      dispatch({ type: "RESET_INPUT" });
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  return (
    <div>
        
      <button

        className="fixed bottom-6 right-6 btn btn-primary rounded-full shadow-lg z-50"
        onClick={() => dispatch({ type: "TOGGLE_OPEN" })}
      >
        💬 CompanionAI
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-100 bg-base-100 border rounded-xl shadow-lg z-50 flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <span className="font-bold"><b>CompanionAI - </b></span>
            <button onClick={() => dispatch({ type: "CLOSE" })} className="btn btn-xs btn-ghost">✕</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto max-h-80">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.from === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.from === "user" ? "bg-primary text-white" : "bg-base-200"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-left text-xs opacity-70">Bot is typing...</div>}
          </div>

          <form onSubmit={sendMessage} className="p-2 border-t flex gap-2">
            <input
              className="input input-bordered flex-1"
              value={input}
              onChange={(e) => dispatch({ type: "SET_INPUT", value: e.target.value })}
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
