import { useContext } from "react";
import { Bell } from "lucide-react";
import { Layout, Button, Avatar, Badge, Typography } from "antd";
import { AuthContext } from "../context/AuthContext";
import AvatarGroup from "./Avatar";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header({ title, subtitle }) {
  const { user, authLoading } = useContext(AuthContext);
  console.log("user", user);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "User";

  return (
    <AntHeader
      className="
     sticky top-0 z-30
     !flex !h-16 !items-center !justify-between
     !border-b !border-slate-200
     !bg-white/80
     !px-4
     backdrop-blur-xl
     sm:!px-6
   "
    >
      {" "}
      <div className="min-w-0 flex-1">
        <Typography.Title
          level={4}
          className="
!m-0
!truncate
!text-[18px]
!font-bold
!tracking-[-0.02em]
!text-slate-900
sm:!text-xl
"
        >
          {title}
        </Typography.Title>

        {subtitle && (
          <Text
            type="secondary"
            className="
          !block
          !truncate
          !text-xs
          sm:!text-sm
        "
          >
            {subtitle}
          </Text>
        )}
      </div>
      <div className="ml-3 flex shrink-0 items-center gap-1 sm:gap-3">
        <Badge dot offset={[-4, 5]}>
          <Button
            type="text"
            icon={<Bell size={18} />}
            className="
          !flex
          !h-10
          !w-10
          !items-center
          !justify-center
          !rounded-lg
          !text-slate-500
          hover:!bg-slate-100
        "
          />
        </Badge>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

        <Button
          type="text"
          className="
        !flex
        !h-11
        !items-center
        !gap-2
        !rounded-lg
        !px-1
        sm:!gap-2.5
        sm:!px-2
      "
        >
          {user && <AvatarGroup members={user} />}
          <div className="hidden text-left sm:block">
            <div className="text-sm font-semibold leading-tight text-slate-800">
              {authLoading ? "Loading..." : fullName}
            </div>

            <div className="mt-0.5 text-[11px] leading-tight text-slate-400">
              {authLoading ? "" : user?.role}
            </div>
          </div>
        </Button>
      </div>
    </AntHeader>
  );
}
