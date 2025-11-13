import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.string().min(1).optional(),
});

// Cost validation schemas
export const costSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().min(1),
});

export const costUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category: z.string().min(1).optional(),
});

// Sale validation schemas
export const saleSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive(),
  customer: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  total: z.number().positive(),
});

export const saleUpdateSchema = z.object({
  productId: z.string().min(1).optional(),
  quantity: z.number().positive().optional(),
  customer: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  total: z.number().positive().optional(),
});

// Purchase validation schemas
export const purchaseSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive(),
  supplier: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  total: z.number().positive(),
});

export const purchaseUpdateSchema = z.object({
  productId: z.string().min(1).optional(),
  quantity: z.number().positive().optional(),
  supplier: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  total: z.number().positive().optional(),
});

// Stock validation schemas
export const stockSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0),
  location: z.string().min(1),
});

export const stockUpdateSchema = z.object({
  productId: z.string().min(1).optional(),
  quantity: z.number().int().min(0).optional(),
  location: z.string().min(1).optional(),
});

// Payment validation schemas
export const paymentSchema = z.object({
  customer: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  method: z.string().min(1),
  reference: z.string().optional(),
});

export const paymentUpdateSchema = z.object({
  customer: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  method: z.string().min(1).optional(),
  reference: z.string().optional(),
});

// Report validation schemas
export const salesTargetsReportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const costPriceReportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const stockLevelsReportSchema = z.object({
  location: z.string().optional(),
});

export const customerBalancesReportSchema = z.object({
  customer: z.string().optional(),
});

export const profitabilityReportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// Generic validation utility functions
export const validate = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    return { 
      success: false, 
      error: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    };
  }
};

export const validateUser = (data) => validate(userSchema, data);
export const validateLogin = (data) => validate(loginSchema, data);
export const validateProduct = (data) => validate(productSchema, data);
export const validateProductUpdate = (data) => validate(productUpdateSchema, data);
export const validateCost = (data) => validate(costSchema, data);
export const validateCostUpdate = (data) => validate(costUpdateSchema, data);
export const validateSale = (data) => validate(saleSchema, data);
export const validateSaleUpdate = (data) => validate(saleUpdateSchema, data);
export const validatePurchase = (data) => validate(purchaseSchema, data);
export const validatePurchaseUpdate = (data) => validate(purchaseUpdateSchema, data);
export const validateStock = (data) => validate(stockSchema, data);
export const validateStockUpdate = (data) => validate(stockUpdateSchema, data);
export const validatePayment = (data) => validate(paymentSchema, data);
export const validatePaymentUpdate = (data) => validate(paymentUpdateSchema, data);
export const validateSalesTargetsReport = (data) => validate(salesTargetsReportSchema, data);
export const validateCostPriceReport = (data) => validate(costPriceReportSchema, data);
export const validateStockLevelsReport = (data) => validate(stockLevelsReportSchema, data);
export const validateCustomerBalancesReport = (data) => validate(customerBalancesReportSchema, data);
export const validateProfitabilityReport = (data) => validate(profitabilityReportSchema, data);