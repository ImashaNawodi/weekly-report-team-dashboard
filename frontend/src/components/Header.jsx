import { Bell, Search, ChevronDown } from "lucide-react";
import { Layout, Input, Button, Avatar, Badge, Typography } from "antd";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header({ title, subtitle }) {
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
          <Avatar
            size={32}
            className="
              !flex
              !shrink-0
              !items-center
              !justify-center
              !bg-gradient-to-br
              !from-blue-500
              !to-blue-700
              !text-xs
              !font-bold
              !text-white
            "
          >
            DK
          </Avatar>

          <div className="hidden text-left sm:block">
            <div className="text-sm font-semibold leading-tight text-slate-800">
              David Kim
            </div>

            <div className="mt-0.5 text-[11px] leading-tight text-slate-400">
              Manager
            </div>
          </div>

          <ChevronDown size={16} className="shrink-0 text-slate-400" />
        </Button>
      </div>
    </AntHeader>
  );
}
