"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const coins = [
  {
    name: "Bitcoin",
    short_name: "BTC",
    icon: "bitcoin"
  },
  {
    name: "Avalanche",
    short_name: "AVAX",
    icon: "avalanche"
  },
  {
    name: "Ethereum",
    short_name: "ETH",
    icon: "ethereum"
  },
  {
    name: "Solana",
    short_name: "SOL",
    icon: "solana"
  },
  {
    name: "Tether",
    short_name: "USDT",
    icon: "tether"
  },
  {
    name: "XRP",
    short_name: "XRP",
    icon: "xrp"
  },
  {
    name: "Dogecoin",
    short_name: "DOGE",
    icon: "dogecoin"
  }
];

export function TradingCard() {
  const form = useForm();
  const [selectedCoin, setSelectedCoin] = useState<string>(coins[0].name);
  const [transactionType, setTransactionType] = useState<string>("buy");

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardDescription>Trading</CardDescription>
          <CardTitle className="text-3xl">$46,200</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buy" onValueChange={setTransactionType}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger className="w-full" value="buy">
                Buy
              </TabsTrigger>
              <TabsTrigger className="w-full" value="sell">
                Sell
              </TabsTrigger>
            </TabsList>
            <TabsContent value="buy">
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coin</FormLabel>
                        <FormControl>
                          <Select defaultValue={selectedCoin} onValueChange={setSelectedCoin}>
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <Image
                                    width={20}
                                    height={20}
                                    className="size-6"
                                    src={`${process.env.ASSETS_URL}/crypto-icons/${coins.find((coin) => coin.name === selectedCoin)?.icon}.svg`}
                                    unoptimized
                                    alt="..."
                                  />
                                  {coins.find((coin) => coin.name === selectedCoin)?.name}/
                                  {coins.find((coin) => coin.name === selectedCoin)?.short_name}
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {coins.map((coin) => (
                                <SelectItem key={coin.name} value={coin.name}>
                                  <div className="flex items-center gap-2">
                                    <Image
                                      width={20}
                                      height={20}
                                      className="size-6"
                                      src={`${process.env.ASSETS_URL}/crypto-icons/${coin.icon}.svg`}
                                      unoptimized
                                      alt="..."
                                    />
                                    {coin.name}/{coin.short_name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid space-y-4 lg:grid-cols-2 lg:space-y-0 lg:space-x-4">
                    <FormField
                      control={form.control}
                      name="amount_coin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Amount ({coins.find((c) => c.name === selectedCoin)?.short_name})
                          </FormLabel>
                          <FormControl>
                            <Input defaultValue="$0,0000005" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount_currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (USD)</FormLabel>
                          <FormControl>
                            <Input defaultValue="0,0000005" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button className="w-full">Make Payment</Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="sell">
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coin</FormLabel>
                        <FormControl>
                          <Select defaultValue={selectedCoin} onValueChange={setSelectedCoin}>
                            <SelectTrigger className="w-full">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                  <Image
                                    width={20}
                                    height={20}
                                    className="size-6"
                                    src={`${process.env.ASSETS_URL}/crypto-icons/${coins.find((coin) => coin.name === selectedCoin)?.icon}.svg`}
                                    unoptimized
                                    alt="..."
                                  />
                                  {coins.find((coin) => coin.name === selectedCoin)?.name}/
                                  {coins.find((coin) => coin.name === selectedCoin)?.short_name}
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {coins.map((coin) => (
                                <SelectItem key={coin.name} value={coin.name}>
                                  <div className="flex items-center gap-2">
                                    <Image
                                      width={20}
                                      height={20}
                                      className="size-6"
                                      src={`${process.env.ASSETS_URL}/crypto-icons/${coin.icon}.svg`}
                                      unoptimized
                                      alt="..."
                                    />
                                    {coin.name}/{coin.short_name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid space-y-4 lg:grid-cols-2 lg:space-y-0 lg:space-x-4">
                    <FormField
                      control={form.control}
                      name="amount_coin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (BTC)</FormLabel>
                          <FormControl>
                            <Input defaultValue="$0,0000008" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount_currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (USD)</FormLabel>
                          <FormControl>
                            <Input defaultValue="0,0000004" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button className="w-full">Place Offer</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
