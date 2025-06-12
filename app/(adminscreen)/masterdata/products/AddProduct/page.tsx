"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "SKU is required"),
  image: z.any().optional(), // เพิ่ม image เข้ามา
});

const formSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  image: z.any().optional(),
  variants: z.array(variantSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProductFormPage() {
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>(
    {}
  );
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      description: "",
      variants: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  function onSubmit(values: FormValues) {
    console.log("Submitted:", values);
  }

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [index]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      form.setValue(`variants.${index}.image`, file); // ใส่ไฟล์ในฟอร์ม
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Enter product description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label className="mb-2" htmlFor="image">
                  Product Image
                </Label>
                <Input type="file" id="image" {...form.register("image")} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Variants</h3>
                  <Button
                    type="button"
                    size="sm"
                    className="hover:bg-red-200"
                    variant="secondary"
                    onClick={() => appendVariant({ name: "", sku: "" })}
                  >
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Variant
                  </Button>
                </div>

                <div className="space-y-4">
                  {variantFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-4 rounded-lg"
                    >
                      <FormField
                        control={form.control}
                        name={`variants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sku</FormLabel>
                            <FormControl>
                              <Input placeholder="Size / Color" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variants.${index}.sku`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size</FormLabel>
                            <FormControl>
                              <Input placeholder="SKU12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variants.${index}.sku`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <Input placeholder="SKU12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                      <FormField
                        control={form.control}
                        name={`variants.${index}.image`}
                        render={() => (
                          <FormItem>
                            <FormLabel>Variant Image</FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageChange(e, index)}
                                />
                                {imagePreviews[index] && (
                                  <img
                                    src={imagePreviews[index]}
                                    alt="Preview"
                                    className="h-24 w-24 object-cover border rounded"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Submit Product
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
