import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().min(1, 'SKU is required'),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  sku: z.string().min(1, 'SKU is required').optional(),
});

// Cost validation schemas
export const costSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  category: z.string().min(1, 'Category is required'),
});

// Sale validation schemas
export const saleSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  customerId: z.string().min(1, 'Customer ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

// Purchase validation schemas
export const purchaseSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  supplierId: z.string().min(1, 'Supplier ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

// Stock validation schemas
export const stockSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  warehouse: z.string().min(1, 'Warehouse is required'),
});

// Payment validation schemas
export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  type: z.enum(['income', 'expense'], 'Invalid payment type'),
  description: z.string().min(1, 'Description is required'),
  customerId: z.string().optional(),
  supplierId: z.string().optional(),
});

// Report validation schemas
export const salesTargetReportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

export const costPriceReportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

export const stockLevelsReportSchema = z.object({
  warehouse: z.string().optional(),
});

export const customerBalancesReportSchema = z.object({
  customerId: z.string().optional(),
});

export const profitabilityReportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

// Utility function to validate and sanitize data
export const validateAndSanitize = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    throw error;
  }
};

// Utility function to validate with specific error messages
export const validateWithMessages = (schema, data, customMessages = {}) => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => {
        const field = err.path.join('.');
        const customMessage = customMessages[field];
        return {
          field,
          message: customMessage || err.message,
        };
      });
      return { success: false, errors };
    }
    throw error;
  }
};

// Export all schemas for easy access
export const schemas = {
  user: userSchema,
  login: loginSchema,
  product: productSchema,
  productUpdate: productUpdateSchema,
  cost: costSchema,
  sale: saleSchema,
  purchase: purchaseSchema,
  stock: stockSchema,
  payment: paymentSchema,
  salesTargetReport: salesTargetReportSchema,
  costPriceReport: costPriceReportSchema,
  stockLevelsReport: stockLevelsReportSchema,
  customerBalancesReport: customerBalancesReportSchema,
  profitabilityReport: profitabilityReportSchema,
};

export function validateProduct() {
    // TODO: Implement validateProduct
    throw new Error('validateProduct not implemented');
}

export function validateSale() {
    // TODO: Implement validateSale
    throw new Error('validateSale not implemented');
}
