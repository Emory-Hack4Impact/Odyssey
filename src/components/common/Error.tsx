"use client";

export default function Error({ message }: { message: string }) {
  return (
    <div className="flex flex-row justify-center">
      <p className="text-base-600 text-center font-light whitespace-pre-wrap">{message}</p>
    </div>
  );
}
