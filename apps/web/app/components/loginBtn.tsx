import Link from "next/link";
import PrimaryButton from "./ui/primaryButton";

export default function LoginBtn() {
  return (
    <Link href="/login" className="flex items-end justify-end">
      <PrimaryButton>Log in</PrimaryButton>
    </Link>
  );
}
