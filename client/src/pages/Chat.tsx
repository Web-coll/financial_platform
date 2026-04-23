import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { Streamdown } from "streamdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
        },
      ]);
      setInput("");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    sendMessage.mutate({ message: input });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto h-[calc(100vh-48px)] flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-8 h-8 text-green-500" />
            <h1 className="text-3xl font-bold text-white">Asistente Financiero IA</h1>
          </div>
          <p className="text-slate-400">Haz preguntas sobre tu presupuesto, inversiones y finanzas personales</p>
        </div>

        <Card className="flex-1 bg-slate-800 border-slate-700 flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <MessageCircle className="w-16 h-16 text-slate-600 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">Bienvenido al Asistente Financiero</h3>
                    <p className="text-slate-400 max-w-md">Puedo ayudarte con preguntas sobre:</p>
                    <ul className="text-slate-400 text-sm mt-2 space-y-1">
                      <li>Tu presupuesto y gastos</li>
                      <li>Estrategias de inversión</li>
                      <li>Conceptos financieros</li>
                      <li>Metas de ahorro</li>
                      <li>Recomendaciones personalizadas</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-green-600 text-white rounded-br-none"
                          : "bg-slate-700 text-slate-100 rounded-bl-none"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Streamdown>{message.content}</Streamdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      <p className={`text-xs mt-2 ${
                        message.role === "user" ? "text-green-100" : "text-slate-400"
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {sendMessage.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Pensando...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          <div className="border-t border-slate-700 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Escribe tu pregunta aqui..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sendMessage.isPending}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={sendMessage.isPending || !input.trim()}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
