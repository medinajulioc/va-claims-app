import { generateMeta } from "@/lib/utils";
import ProductImageGallery from "./product-image-gallery";
import {
  CircleDollarSign,
  Edit3Icon,
  HandCoinsIcon,
  HeartIcon,
  Layers2Icon,
  ShoppingCart,
  StarIcon,
  Trash2Icon,
  TruckIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductReviewList from "./reviews";
import SubmitReviewForm from "./submit-review-form";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export async function generateMetadata() {
  return generateMeta({
    title: "Product Detail Page",
    description:
      "Use this shadcn/ui and Tailwind CSS product page template to create great looking pages for each product, with detailed descriptions, images, pricing, and customer reviews.",
    canonical: "/pages/products/detail"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Acme Prism T-Shirt</h1>
          <div className="text-muted-foreground inline-flex flex-col gap-2 text-sm lg:flex-row lg:gap-4">
            <div>
              <span className="text-foreground font-semibold">Seller :</span> Poetic Fashion
            </div>
            <div>
              <span className="text-foreground font-semibold">Published :</span> 20 Oct, 2024
            </div>
            <div>
              <span className="text-foreground font-semibold">SKU :</span> WH1000XM4
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Edit3Icon />
            <span className="hidden lg:inline">Edit</span>
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2Icon />
          </Button>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-1">
          <ProductImageGallery />
        </div>
        <div className="space-y-4 xl:col-span-2">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
              <CircleDollarSign className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Price</span>
                <span className="text-lg font-semibold">$120.40</span>
              </div>
            </div>
            <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
              <TruckIcon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">No. of Orders</span>
                <span className="text-lg font-semibold">250</span>
              </div>
            </div>
            <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
              <Layers2Icon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Available Stocks</span>
                <span className="text-lg font-semibold">2,550</span>
              </div>
            </div>
            <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
              <HandCoinsIcon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Total Revenue</span>
                <span className="text-lg font-semibold">$45,938</span>
              </div>
            </div>
          </div>
          <Card>
            <CardContent className="space-y-4">
              <div className="grid items-start gap-8 xl:grid-cols-3">
                <div className="space-y-8 xl:col-span-2">
                  <div>
                    <h3 className="mb-2 font-semibold">Description:</h3>
                    <p className="text-muted-foreground">
                      Tommy Hilfiger men striped pink sweatshirt. Crafted with cotton. Material
                      composition is 100% organic cotton.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Key Features:</h3>
                    <ul className="text-muted-foreground list-inside list-disc">
                      <li>Industry-leading noise cancellation</li>
                      <li>30-hour battery life</li>
                      <li>Touch sensor controls</li>
                      <li>Speak-to-chat technology</li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-md border xl:col-span-1">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">Category</TableCell>
                        <TableCell className="text-right">T-Shirt</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Brand</TableCell>
                        <TableCell className="text-right">Tommy Hilfiger</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Color</TableCell>
                        <TableCell className="text-right">Purple</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Weight</TableCell>
                        <TableCell className="text-right">140 Gr</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="grid auto-cols-max grid-flow-row gap-8">
                <div>
                  <div className="mb-4 font-semibold">Colors:</div>
                  <RadioGroup defaultValue="card" className="flex gap-2">
                    <div>
                      <RadioGroupItem
                        value="card"
                        id="card"
                        className="peer sr-only"
                        aria-label="Card"
                      />
                      <Label
                        htmlFor="card"
                        className="border-muted hover:text-accent-foreground peer-data-[state=checked]:ring-primary [&:has([data-state=checked])]:border-primary flex size-8 cursor-pointer flex-col items-center justify-between rounded-full border bg-green-400 -indent-[9999px] peer-data-[state=checked]:ring">
                        Card
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="paypal"
                        id="paypal"
                        className="peer sr-only"
                        aria-label="Paypal"
                      />
                      <Label
                        htmlFor="paypal"
                        className="border-muted hover:text-accent-foreground peer-data-[state=checked]:ring-primary [&:has([data-state=checked])]:border-primary flex size-8 cursor-pointer flex-col items-center justify-between rounded-full border bg-indigo-400 -indent-[9999px] peer-data-[state=checked]:ring">
                        Paypal
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="apple"
                        id="apple"
                        className="peer sr-only"
                        aria-label="Apple"
                      />
                      <Label
                        htmlFor="apple"
                        className="border-muted hover:text-accent-foreground peer-data-[state=checked]:ring-primary [&:has([data-state=checked])]:border-primary flex size-8 cursor-pointer flex-col items-center justify-between rounded-full border bg-purple-400 -indent-[9999px] peer-data-[state=checked]:ring">
                        Apple
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <div className="mb-4 font-semibold">Sizes:</div>
                  <RadioGroup defaultValue="md" className="flex gap-2">
                    <div>
                      <RadioGroupItem value="sm" id="sm" className="peer sr-only" aria-label="sm" />
                      <Label
                        htmlFor="sm"
                        className="bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex size-10 cursor-pointer flex-col items-center justify-center rounded-full border text-xs">
                        SM
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="lg" id="lg" className="peer sr-only" aria-label="lg" />
                      <Label
                        htmlFor="lg"
                        className="bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex size-10 cursor-pointer flex-col items-center justify-center rounded-full border text-xs">
                        LG
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="xl" id="xl" className="peer sr-only" aria-label="xl" />
                      <Label
                        htmlFor="xl"
                        className="bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex size-10 cursor-pointer flex-col items-center justify-center rounded-full border text-xs">
                        XL
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="xxl"
                        id="xxl"
                        className="peer sr-only"
                        aria-label="xxl"
                      />
                      <Label
                        htmlFor="xxl"
                        className="bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex size-10 cursor-pointer flex-col items-center justify-center rounded-full border text-xs">
                        XXL
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button>
                  <ShoppingCart /> Add to Card
                </Button>
                <Button variant="outline">
                  <HeartIcon /> Wishlist
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row justify-between">
              <CardTitle>Reviews</CardTitle>
              <CardAction>
                <SubmitReviewForm />
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="order-last lg:order-first xl:col-span-2">
                  <ProductReviewList />
                </div>
                <div className="order-first lg:order-last xl:col-span-1">
                  <div className="overflow-hidden rounded-lg border">
                    <div className="bg-muted flex items-center gap-4 p-4">
                      <div className="flex items-center gap-1">
                        <StarIcon className="size-4 fill-orange-400 stroke-orange-400" />
                        <StarIcon className="size-4 fill-orange-400 stroke-orange-400" />
                        <StarIcon className="size-4 fill-orange-400 stroke-orange-400" />
                        <StarIcon className="size-4 stroke-orange-400" />
                        <StarIcon className="size-4 stroke-orange-400" />
                      </div>
                      <span className="text-muted-foreground">4.3 (12 reviews)</span>
                    </div>
                    <div className="space-y-4 p-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">5 stars</span>
                        <Progress value={70} color="bg-orange-400" />
                        <span>70%</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">4 stars</span>
                        <Progress value={17} color="bg-orange-600" />
                        <span>17%</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">3 stars</span>
                        <Progress value={7} color="bg-yellow-300" />
                        <span>7%</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">2 stars</span>
                        <Progress value={4} color="bg-yellow-600" />
                        <span>4%</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">1 star</span>
                        <Progress value={2} color="bg-red-600" />
                        <span>2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
