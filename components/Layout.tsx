import { Fragment, ReactNode, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChartBarIcon,
  ClipboardListIcon,
  FlagIcon,
  HomeIcon,
  LibraryIcon,
  KeyIcon,
  MenuIcon,
  TrendingUpIcon,
  XIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useUser } from "../data/use-user";
import { login, logout } from "../lib/auth";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Chart", href: "/chart", icon: ChartBarIcon },
  { name: "Markets", href: "/markets", icon: LibraryIcon },
  { name: "Orders", href: "/orders", icon: ClipboardListIcon },
  {
    name: "Positions",
    href: "/positions",
    icon: TrendingUpIcon,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type LayoutProps = {
  children?: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, loggedOut, mutate } = useUser();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-900">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 md:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Flagpole"
                  />
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a
                        className={classNames(
                          item.href === router.pathname
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.href === router.pathname
                              ? "text-gray-300"
                              : "text-gray-400 group-hover:text-gray-300",
                            "mr-4 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex bg-gray-700 p-4">
                <a href="#" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <KeyIcon className="inline-block h-9 w-9 rounded-full stroke-current text-white" />
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-base font-medium text-white">
                        {user?.wallet}
                      </p>
                      <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 truncate">
                        {user?.key}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-48">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <FlagIcon
                  className="h-8 w-auto stroke-current text-pink-600"
                  aria-hidden="true"
                />
                <h1 className="pl-2 text-2xl font-semibold text-gray-100">
                  Flagpole
                </h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={classNames(
                        item.href === router.pathname
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.href === router.pathname
                            ? "text-gray-300"
                            : "text-gray-400 group-hover:text-gray-300",
                          "mr-3 flex-shrink-0 h-6 w-6"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              <a href="#" className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <KeyIcon className="inline-block h-9 w-9 rounded-full stroke-current text-white" />
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-base font-medium text-white">
                      {user?.wallet}
                    </p>
                    <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">
                      {user?.key}
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="h-full">
            <div className="border-b border-gray-800 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold text-gray-100">
                  {navigation.find((item) =>
                    router.pathname.includes(item.href)
                  )?.name ?? "Dashboard"}
                </h1>
              </div>
              <div className="mt-4 flex sm:mt-0 sm:ml-4">
                {loggedOut ? (
                  <Link href="/signin">
                    <button
                      type="button"
                      className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:order-1 sm:ml-3"
                    >
                      Login
                    </button>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="order-1 ml-3 inline-flex items-center px-4 py-2 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:order-0 sm:ml-0"
                    onClick={() => {
                      logout();
                      mutate({ token: null, wallet: null, key: null });
                      router.replace("/");
                    }}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
            <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
