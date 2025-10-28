import { Card } from "../ui/card";
import { type RefObject } from "react";
import MotionComponent from "./motion";
import CreateGuildForm from "../form/createGuildForm";

export default function CreateGuildMotion({
  cardRef,
}: {
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <MotionComponent>
      <Card
        ref={cardRef}
        className={`relative w-[600px] max-w-md overflow-y-auto scrollbar-custom p-6 bg-white border-cyan-300 rounded-4xl`}
      >
        <CreateGuildForm />
      </Card>
    </MotionComponent>
  );
}
