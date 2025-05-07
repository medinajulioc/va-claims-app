"use client";

import { Fragment, useEffect } from "react";
import Link from "next/link";
import { page_routes, admin_routes } from "@/lib/routes-config";
import { ChevronRight, ChevronsUpDown } from "lucide-react";
import { usePathname } from "next/navigation";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/icon";
import Logo from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { useIsTablet } from "@/hooks/use-mobile";

export default function Sidebar() {
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const isTablet = useIsTablet();
  
  // Determine if we're in the admin section
  const isAdminPath = pathname?.startsWith('/bdoc');
  
  // Select the appropriate routes based on the path
  const routesToShow = isAdminPath ? admin_routes : page_routes;

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    setOpen(!isTablet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTablet]);

  return (
    <SidebarContainer collapsible="icon" variant="floating" className="bg-background">
      <SidebarHeader className="items-center justify-center pt-3 transition-all group-data-[collapsible=icon]:pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="rounded-none group-data-[collapsible=icon]:px-0!">
                  <Logo />
                  <div className="truncate font-semibold group-data-[collapsible=icon]:hidden">
                    {isAdminPath ? "VA Claims Admin" : "VA Claims Dashboard"}
                  </div>
                  <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
                {!isAdminPath && (
                  <DropdownMenuItem>
                    <span>Ecommerce</span>
                  </DropdownMenuItem>
                )}
                {!isAdminPath && (
                  <DropdownMenuItem>
                    <span>Web Analytics</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full">
          {routesToShow.map((route, key) => (
            <SidebarGroup key={key}>
              <SidebarGroupLabel className="text-xs tracking-wider uppercase">
                {route.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {route.items.map((item, key) => (
                    <SidebarMenuItem key={key}>
                      {item.items?.length ? (
                        <Fragment>
                          <div className="hidden group-data-[collapsible=icon]:block">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                  {item.icon && (
                                    <Icon
                                      name={item.icon}
                                      className="text-muted-foreground size-4"
                                    />
                                  )}
                                  <span>{item.title}</span>
                                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                              </DropdownMenuTrigger>
                              {item.items?.length ? (
                                <DropdownMenuContent
                                  side={isMobile ? "bottom" : "right"}
                                  align={isMobile ? "end" : "start"}
                                  className="min-w-48 rounded-lg">
                                  <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                                  {item.items.map((item) => (
                                    <DropdownMenuItem asChild key={item.title}>
                                      <a href={item.href}>{item.title}</a>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              ) : null}
                            </DropdownMenu>
                          </div>
                          <Collapsible className="group/collapsible block group-data-[collapsible=icon]:hidden">
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={item.title}>
                                {item.icon && (
                                  <Icon name={item.icon} className="text-muted-foreground size-4" />
                                )}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.items.map((subItem, key) => (
                                  <SidebarMenuSubItem key={key}>
                                    <SidebarMenuSubButton
                                      isActive={pathname === subItem.href}
                                      asChild>
                                      <Link
                                        href={subItem.href}
                                        target={subItem.newTab ? "_blank" : ""}>
                                        {subItem.icon && (
                                          <Icon
                                            name={subItem.icon}
                                            className="text-muted-foreground size-4"
                                          />
                                        )}
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </Collapsible>
                        </Fragment>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={pathname === item.href}>
                          <Link href={item.href} target={item.newTab ? "_blank" : ""}>
                            {item.icon && (
                              <Icon name={item.icon} className="text-muted-foreground size-4" />
                            )}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                      {item.isComing ? (
                        <SidebarMenuBadge className="opacity-50">Coming</SidebarMenuBadge>
                      ) : null}
                      {item.isNew ? (
                        <SidebarMenuBadge className="text-green-500 dark:text-green-200">
                          New
                        </SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        {!isAdminPath && (
          <Card className="bg-muted gap-4 py-4 group-data-[collapsible=icon]:hidden">
            <CardHeader className="px-3">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Get pro now to own all dashboards, templates and components for life.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3">
              <Button className="w-full" asChild>
                <Link href="https://shadcnuikit.com/pricing" target="_blank">
                  Get Shadcn UI Kit
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </SidebarFooter>
    </SidebarContainer>
  );
}
