class BaseController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    try {
      const items = await this.service.findAll();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: `Error fetching all ${this.service.model.name}s`, error: error.message });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      const item = await this.service.findByPk(id);
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: `${this.service.model.name} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: `Error fetching ${this.service.model.name}`, error: error.message });
    }
  }

  async create(req, res) {
    const data = req.body;
    try {
      const newItem = await this.service.create(data);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: `Error creating ${this.service.model.name}`, error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedItem = await this.service.update(id, data);
      if (updatedItem) {
        res.status(200).json(updatedItem);
      } else {
        res.status(404).json({ message: `${this.service.model.name} not found or not updated` });
      }
    } catch (error) {
      res.status(500).json({ message: `Error updating ${this.service.model.name}`, error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const isDeleted = await this.service.delete(id);
      if (isDeleted) {
        res.status(204).send(); // No content on successful deletion
      } else {
        res.status(404).json({ message: `${this.service.model.name} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: `Error deleting ${this.service.model.name}`, error: error.message });
    }
  }
}

module.exports = BaseController;