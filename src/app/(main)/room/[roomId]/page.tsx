import ChatView from "@/components/ChatView";
import CodeView from "@/components/CodeView";
import { MessageProvider } from "@/context/MessageContext";

async function Room({ params }: { params: { roomId: string } }) {
  const param = await params;
  const { roomId } = param;

  return (
    <MessageProvider>
      <div className=" flex items-center justify-center py-10 bg-gray-900">
        <div className="w-[30%]">
          <ChatView roomId={roomId} />
        </div>

        <div className="w-[70%]">
          <CodeView roomId={roomId} />
        </div>
      </div>
    </MessageProvider>
  );
}

export default Room;
