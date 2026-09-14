const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  job_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  tool_type: {
    type: String,
    required: true,
    enum: [
      'merge', 'split', 'compress',
      'convert_word_to_pdf', 'convert_pdf_to_word',
      'convert_ppt_to_pdf', 'convert_pdf_to_ppt',
      'convert_excel_to_pdf', 'convert_pdf_to_excel',
      'convert_jpg_to_pdf', 'convert_pdf_to_jpg',
      'convert_html_to_pdf', 'convert_pdf_to_pdfa'
    ]
  },
  status: {
    type: String,
    required: true,
    enum: ['queued', 'processing', 'done', 'failed'],
    default: 'queued'
  },
  input_files: [{
    file_id: { type: String, required: true },
    original_name: { type: String, required: true }
  }],
  output_files: [{
    file_id: { type: String, required: true },
    path: { type: String, required: true }
  }],
  options: {
    type: Object,
    default: {}
  },
  error_message: { type: String },
  retry_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  started_at: { type: Date },
  completed_at: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);