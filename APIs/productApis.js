import exp from 'express';
import { ProductModel } from '../Model/productmodel.js';

export const productApp = exp.Router();

// get all products
productApp.get('/products', async (req, res) => {
  try {
    const list = await ProductModel.find().populate('createdBy', 'username email').select('-__v');
    res.status(200).json({ message: 'product list', payload: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// get product by id
productApp.get('/products/:id', async (req, res) => {
  try {
    const prod = await ProductModel.findById(req.params.id).populate('createdBy', 'username email').select('-__v');
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'product', payload: prod });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// create product
productApp.post('/products', async (req, res) => {
  try {
    const userId = req.body.userId;   // temporarily take from body

    const newProd = new ProductModel({
      ...req.body,
      createdBy: userId
    });
    await newProd.save();
    res.status(201).json({ message: 'product created', payload: newProd });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// update product
productApp.put('/products/:id', async (req, res) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-__v');
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'product updated', payload: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// delete product
productApp.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
