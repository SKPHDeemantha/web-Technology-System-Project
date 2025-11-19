// Enhanced Data Management System for Community Panel
class DataManager {
  constructor() {
    this.storagePrefix = "community_";
    this.backupPrefix = "backup_community_";
    this.version = "1.0.0";
    this.maxBackups = 5;
    this.init();
  }

  init() {
    this.migrateLegacyData();
    this.createInitialDataStructure();
    this.setupAutoBackup();
  }

  // Data validation and sanitization
  validateData(data, schema) {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format");
    }

    // Basic validation - extend based on schema
    if (schema) {
      for (const [key, rules] of Object.entries(schema)) {
        if (rules.required && !(key in data)) {
          throw new Error(`Required field missing: ${key}`);
        }

        if (data[key] && rules.type && typeof data[key] !== rules.type) {
          throw new Error(
            `Invalid type for field ${key}: expected ${rules.type}`
          );
        }

        if (
          rules.maxLength &&
          data[key] &&
          data[key].length > rules.maxLength
        ) {
          throw new Error(
            `Field ${key} exceeds maximum length of ${rules.maxLength}`
          );
        }
      }
    }

    return true;
  }

  // Enhanced localStorage operations with error handling
  setItem(key, value, schema = null) {
    try {
      // Validate data before storing
      if (schema) {
        this.validateData(value, schema);
      }

      // Add metadata
      const dataWithMeta = {
        data: value,
        timestamp: new Date().toISOString(),
        version: this.version,
        checksum: this.generateChecksum(value),
      };

      const serialized = JSON.stringify(dataWithMeta);
      localStorage.setItem(this.storagePrefix + key, serialized);

      // Trigger auto-backup
      this.createBackup(key);

      return true;
    } catch (error) {
      console.error("Error saving data:", error);
      throw new Error(`Failed to save data for key "${key}": ${error.message}`);
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const serialized = localStorage.getItem(this.storagePrefix + key);
      if (!serialized) {
        return defaultValue;
      }

      const parsed = JSON.parse(serialized);

      // Validate data integrity
      if (parsed.checksum && parsed.data) {
        const currentChecksum = this.generateChecksum(parsed.data);
        if (currentChecksum !== parsed.checksum) {
          console.warn(
            `Data corruption detected for key "${key}". Using backup if available.`
          );
          return this.restoreFromBackup(key) || defaultValue;
        }
      }

      return parsed.data;
    } catch (error) {
      console.error("Error loading data:", error);
      return this.restoreFromBackup(key) || defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(this.storagePrefix + key);
      this.removeBackup(key);
      return true;
    } catch (error) {
      console.error("Error removing data:", error);
      return false;
    }
  }

  // Checksum generation for data integrity
  generateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Backup and restore functionality
  createBackup(key) {
    try {
      const data = localStorage.getItem(this.storagePrefix + key);
      if (!data) return;

      const backupKey = this.backupPrefix + key;
      const existingBackups = this.getBackupList(key);

      // Rotate backups (keep only maxBackups)
      if (existingBackups.length >= this.maxBackups) {
        const oldestBackup = existingBackups.shift();
        localStorage.removeItem(oldestBackup);
      }

      const timestamp = new Date().toISOString();
      const backupData = {
        data: data,
        timestamp: timestamp,
        originalKey: key,
      };

      existingBackups.push(backupKey + "_" + Date.now());
      localStorage.setItem(
        existingBackups[existingBackups.length - 1],
        JSON.stringify(backupData)
      );
      localStorage.setItem(
        backupKey + "_list",
        JSON.stringify(existingBackups)
      );
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  }

  restoreFromBackup(key) {
    try {
      const backupList = this.getBackupList(key);
      if (backupList.length === 0) return null;

      // Use the most recent backup
      const latestBackup = backupList[backupList.length - 1];
      const backupData = JSON.parse(localStorage.getItem(latestBackup));

      if (backupData && backupData.data) {
        console.log(`Restoring data for "${key}" from backup`);
        localStorage.setItem(this.storagePrefix + key, backupData.data);
        return JSON.parse(backupData.data).data;
      }
    } catch (error) {
      console.error("Error restoring from backup:", error);
    }
    return null;
  }

  getBackupList(key) {
    try {
      const listKey = this.backupPrefix + key + "_list";
      const list = localStorage.getItem(listKey);
      return list ? JSON.parse(list) : [];
    } catch (error) {
      return [];
    }
  }

  removeBackup(key) {
    try {
      const backupList = this.getBackupList(key);
      backupList.forEach((backupKey) => {
        localStorage.removeItem(backupKey);
      });
      localStorage.removeItem(this.backupPrefix + key + "_list");
    } catch (error) {
      console.error("Error removing backups:", error);
    }
  }

  // Auto-backup setup
  setupAutoBackup() {
    // Backup every 5 minutes
    setInterval(() => {
      this.performAutoBackup();
    }, 5 * 60 * 1000);
  }

  performAutoBackup() {
    const keys = ["events", "discussions", "files", "communities", "users"];
    keys.forEach((key) => {
      if (localStorage.getItem(this.storagePrefix + key)) {
        this.createBackup(key);
      }
    });
  }

  // Data export/import
  exportData() {
    try {
      const exportData = {
        version: this.version,
        timestamp: new Date().toISOString(),
        data: {},
      };

      // Get all community data
      const keys = [
        "events",
        "discussions",
        "files",
        "communities",
        "users",
        "settings",
      ];
      keys.forEach((key) => {
        const data = this.getItem(key);
        if (data) {
          exportData.data[key] = data;
        }
      });

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  importData(jsonData) {
    try {
      const importData = JSON.parse(jsonData);

      if (!importData.version || !importData.data) {
        throw new Error("Invalid import data format");
      }

      // Validate version compatibility
      if (importData.version !== this.version) {
        console.warn("Import data version mismatch. Attempting migration...");
      }

      // Import each data type
      Object.entries(importData.data).forEach(([key, data]) => {
        this.setItem(key, data);
      });

      console.log("Data import completed successfully");
      return true;
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  // Data migration for legacy data
  migrateLegacyData() {
    const legacyKeys = [
      "communityEvents",
      "communityDiscussions",
      "communityFiles",
    ];

    legacyKeys.forEach((legacyKey) => {
      const legacyData = localStorage.getItem(legacyKey);
      if (legacyData) {
        try {
          const data = JSON.parse(legacyData);
          const newKey = legacyKey.replace("community", "").toLowerCase();
          this.setItem(newKey, data);
          localStorage.removeItem(legacyKey);
          console.log(
            `Migrated legacy data from "${legacyKey}" to "${newKey}"`
          );
        } catch (error) {
          console.error(
            `Failed to migrate legacy data for ${legacyKey}:`,
            error
          );
        }
      }
    });
  }

  // Initialize data structure
  createInitialDataStructure() {
    const defaultData = {
      communities: [],
      events: [],
      discussions: [],
      files: [],
      users: [],
      settings: {
        theme: "light",
        notifications: true,
        autoBackup: true,
      },
    };

    Object.entries(defaultData).forEach(([key, defaultValue]) => {
      if (!this.getItem(key)) {
        this.setItem(key, defaultValue);
      }
    });
  }

  // Utility methods
  clearAllData() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key.startsWith(this.storagePrefix) ||
        key.startsWith(this.backupPrefix)
      ) {
        localStorage.removeItem(key);
      }
    });
    this.createInitialDataStructure();
  }

  getStorageStats() {
    const keys = Object.keys(localStorage);
    const communityKeys = keys.filter((key) =>
      key.startsWith(this.storagePrefix)
    );
    const backupKeys = keys.filter((key) => key.startsWith(this.backupPrefix));

    let totalSize = 0;
    communityKeys.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) totalSize += data.length;
    });

    return {
      totalKeys: communityKeys.length,
      backupKeys: backupKeys.length,
      totalSize: (totalSize / 1024).toFixed(2) + " KB",
      lastBackup: this.getLastBackupTime(),
    };
  }

  getLastBackupTime() {
    let latestTime = null;
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith(this.backupPrefix) && !key.endsWith("_list")) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.timestamp && (!latestTime || data.timestamp > latestTime)) {
            latestTime = data.timestamp;
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    });

    return latestTime;
  }

  // Data validation schemas
  static getValidationSchemas() {
    return {
      community: {
        name: { required: true, type: "string", maxLength: 100 },
        description: { required: true, type: "string", maxLength: 500 },
        category: { required: true, type: "string" },
        isPublic: { type: "boolean" },
        createdBy: { required: true, type: "string" },
      },
      event: {
        title: { required: true, type: "string", maxLength: 200 },
        description: { required: true, type: "string", maxLength: 1000 },
        date: { required: true, type: "string" },
        time: { required: true, type: "string" },
        location: { required: true, type: "string", maxLength: 200 },
        type: { required: true, type: "string" },
      },
      discussion: {
        title: { required: true, type: "string", maxLength: 200 },
        content: { required: true, type: "string", maxLength: 5000 },
        category: { required: true, type: "string" },
        author: { required: true, type: "string" },
      },
      file: {
        name: { required: true, type: "string", maxLength: 255 },
        size: { required: true, type: "string" },
        type: { required: true, type: "string" },
        uploadedBy: { required: true, type: "string" },
      },
    };
  }
}

// Global instance
const dataManager = new DataManager();

// Export for use in other modules
window.DataManager = DataManager;
window.dataManager = dataManager;
