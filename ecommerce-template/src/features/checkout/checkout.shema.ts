import { z } from "zod"

export const checkoutSchema = z.object({
    fullname : z.string().min(2, "Nombre demasiado corto"),
    email: z.string().email("Email invalido"),
    phone: z.string().min(6, "Telefono invalido").max(30, "Telefono invalido"),
    address1: z.string().min(3,"Direccion invalida"),
    city: z.string().min(2, "Ciudad invalida"),
    postalCode: z.string().min(2,"Codigo postal invalido"),
    country: z.string().min(2,"Pais invalido"),
    shippingMethodId: z.string().min(1,"Elige un metodo de envio"),
    paymentMethodId: z.string().min(1,"Elige un metodo de pago")
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;