// Common File Upload Utility with Progress Tracking and Validation
class FileUploadManager {
    constructor(options = {}) {
        this.maxFileSize = options.maxFileSize || 50 * 1024 * 1024; // 50MB default
        this.allowedTypes = options.allowedTypes || ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar'];
        this.uploadUrl = options.uploadUrl || '/api/upload';
        this.onProgress = options.onProgress || (() => {});
        this.onSuccess = options.onSuccess || (() => {});
        this.onError = options.onError || (() => {});
    }

    // Validate file before upload
    validateFile(file) {
        const errors = [];

        // Check file size
        if (file.size > this.maxFileSize) {
            errors.push(`File size exceeds ${this.formatFileSize(this.maxFileSize)} limit`);
        }

        // Check file type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!this.allowedTypes.includes(fileExtension)) {
            errors.push(`File type .${fileExtension} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Format file size for display
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Upload file with progress tracking
    async uploadFile(file, additionalData = {}) {
        const validation = this.validateFile(file);
        if (!validation.isValid) {
            this.onError(validation.errors.join(', '));
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        // Add additional data
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        try {
            const response = await this.performUpload(formData);
            this.onSuccess(response);
            return response;
        } catch (error) {
            this.onError(error.message || 'Upload failed');
            throw error;
        }
    }

    // Perform the actual upload with progress tracking
    async performUpload(formData) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    this.onProgress(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        resolve({ success: true, message: 'File uploaded successfully' });
                    }
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error occurred during upload'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Upload was cancelled'));
            });

            xhr.open('POST', this.uploadUrl);
            xhr.send(formData);
        });
    }

    // Create upload UI with progress bar
    createUploadUI(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const uploadUI = document.createElement('div');
        uploadUI.className = 'file-upload-ui';
        uploadUI.innerHTML = `
            <div class="upload-drop-zone" id="dropZone-${containerId}">
                <div class="upload-content">
                    <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                    <h5>Drag & drop files here</h5>
                    <p class="text-muted">or <span class="text-primary" style="cursor: pointer;" id="browseBtn-${containerId}">browse files</span></p>
                    <small class="text-muted">Max file size: ${this.formatFileSize(this.maxFileSize)} | Allowed: ${this.allowedTypes.join(', ')}</small>
                </div>
                <input type="file" id="fileInput-${containerId}" style="display: none;" ${options.multiple ? 'multiple' : ''}>
            </div>
            <div class="upload-progress mt-3" id="progress-${containerId}" style="display: none;">
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                </div>
                <div class="upload-status mt-2">
                    <small class="text-muted" id="status-${containerId}">Uploading...</small>
                </div>
            </div>
        `;

        container.appendChild(uploadUI);

        // Setup event listeners
        this.setupUploadEvents(containerId, options);
    }

    // Setup drag and drop events
    setupUploadEvents(containerId, options = {}) {
        const dropZone = document.getElementById(`dropZone-${containerId}`);
        const fileInput = document.getElementById(`fileInput-${containerId}`);
        const browseBtn = document.getElementById(`browseBtn-${containerId}`);
        const progressBar = document.querySelector(`#progress-${containerId} .progress-bar`);
        const statusText = document.getElementById(`status-${containerId}`);

        if (!dropZone || !fileInput) return;

        // Browse button click
        if (browseBtn) {
            browseBtn.addEventListener('click', () => fileInput.click());
        }

        // File input change
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files, containerId, options);
        });

        // Drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('drag-over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files, containerId, options);
        });

        // Override progress callbacks for UI updates
        const originalOnProgress = this.onProgress;
        const originalOnSuccess = this.onSuccess;
        const originalOnError = this.onError;

        this.onProgress = (percent) => {
            if (progressBar) {
                progressBar.style.width = `${percent}%`;
            }
            if (statusText) {
                statusText.textContent = `Uploading... ${percent.toFixed(1)}%`;
            }
            originalOnProgress(percent);
        };

        this.onSuccess = (response) => {
            if (statusText) {
                statusText.textContent = 'Upload completed successfully!';
                statusText.className = 'text-success';
            }
            setTimeout(() => {
                document.getElementById(`progress-${containerId}`).style.display = 'none';
                if (options.onUploadComplete) options.onUploadComplete(response);
            }, 2000);
            originalOnSuccess(response);
        };

        this.onError = (error) => {
            if (statusText) {
                statusText.textContent = `Upload failed: ${error}`;
                statusText.className = 'text-danger';
            }
            setTimeout(() => {
                document.getElementById(`progress-${containerId}`).style.display = 'none';
            }, 3000);
            originalOnError(error);
        };
    }

    // Handle selected/dropped files
    async handleFiles(files, containerId, options = {}) {
        const progressContainer = document.getElementById(`progress-${containerId}`);
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }

        for (const file of files) {
            try {
                await this.uploadFile(file, options.additionalData || {});
            } catch (error) {
                console.error('Upload error:', error);
            }
        }
    }
}

// Utility functions for file management
const FileUtils = {
    // Download file
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Preview file (for images and PDFs)
    previewFile(url, filename, type) {
        if (type.startsWith('image/')) {
            this.showImagePreview(url, filename);
        } else if (type === 'application/pdf') {
            this.showPDFPreview(url, filename);
        } else {
            this.downloadFile(url, filename);
        }
    },

    // Show image preview in modal
    showImagePreview(url, filename) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${filename}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${url}" class="img-fluid" alt="${filename}">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="FileUtils.downloadFile('${url}', '${filename}')">
                            <i class="fas fa-download me-1"></i>Download
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    },

    // Show PDF preview (basic implementation - would need PDF.js for full functionality)
    showPDFPreview(url, filename) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${filename}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <iframe src="${url}" width="100%" height="600px" frameborder="0"></iframe>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="FileUtils.downloadFile('${url}', '${filename}')">
                            <i class="fas fa-download me-1"></i>Download
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }
};

// Export for use in other modules
window.FileUploadManager = FileUploadManager;
window.FileUtils = FileUtils;
