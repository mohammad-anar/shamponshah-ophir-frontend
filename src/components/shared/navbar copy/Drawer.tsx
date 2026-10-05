import { CloseOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Divider, Drawer, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DrawerProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const DrawerPage = ({ open, setOpen }: DrawerProps) => {
  const router = useRouter();
  const onClose = () => {
    setOpen(false);
  };

  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] = [
    { key: "about", label: <Link href={"/about"}>About</Link> },
    {
      key: "events",
      label: "Events",
      children: [
        {
          key: "upcomint-events",
          label: <Link href={"/upcomming-events"}>Upcomming Events</Link>,
        },
        {
          key: "past-events",
          label: <Link href={"/past-events"}>Past Events</Link>,
        },
      ],
    },
    { key: "exhibitions", label: <Link href={"/exibitions"}>Exibitions</Link> },

    {
      key: "galleries",
      label: (
        <Link href={"/gallery"} className="!text-text-body">
          Gallery
        </Link>
      ),
      // children: [
      //   { key: "gallery1", label: <Link href={"/gallery1"}>Gallery 1</Link> },
      //   { key: "gallery2", label: <Link href={"/gallery2"}>Gallery 2</Link> },
      // ],
    },
    {
      key: "workshops-&-course",
      label: <Link href={"/workshop-&-course"}>Workshops & Courses</Link>,
    },
    { key: "blogs", label: <Link href={"/blogs"}>Blogs</Link> },
    { key: "shop", label: <Link href={"/shop"}>Shop</Link> },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  const handleSignupClick = () => {
    router.push("/signup");
  };
  return (
    <>
      <Drawer
        title=""
        closeIcon={<CloseOutlined className="text-2xl !text-black" />}
        className="!border-none"
        onClose={onClose}
        open={open}
      >
        <Menu
          onClick={onClick}
          style={{ width: "100%", borderRight: 0 }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />

        <Divider />
        {/* buttons */}
        <div className="flex flex-col items-center justify-center gap-2 ">
          <Button
            onClick={handleSignupClick}
            className="!p-5 !border-primary w-full !bg-transparent hover:!bg-primary !text-primary hover:!text-white"
          >
            Sign Up
          </Button>
          <Button className="!p-5 !border-none w-full hover:!bg-primary/80 hover:!text-white">
            List with us
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerPage;
