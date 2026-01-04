import Dexie, { Table } from 'dexie';

//------------------------------------------------------
// Interfaces
//------------------------------------------------------

export interface TrainingRecord {
  id?: number;
  imgData: string; // Base64
  aiAnalysis: string;
  expertCorrection: string;
  timestamp: number;
}

//------------------------------------------------------
// Database Class
//------------------------------------------------------

export class TrainingDB extends Dexie {
  trainingRecords!: Table<TrainingRecord>;

  constructor() {
    super('AITrainDB');
    this.version(1).stores({
      trainingRecords: '++id, timestamp'
    });
  }
}

export const db = new TrainingDB();

//------------------------------------------------------
// Manager Class
//------------------------------------------------------

export class TrainingManager {
  
  /**
   * Add a new training record
   */
  async addRecord(imgData: string, aiAnalysis: string, expertCorrection: string) {
    return await db.trainingRecords.add({
      imgData,
      aiAnalysis,
      expertCorrection,
      timestamp: Date.now()
    });
  }

  /**
   * Get all records sorted by time
   */
  async getRecords() {
    return await db.trainingRecords.orderBy('timestamp').reverse().toArray();
  }

  /**
   * Get specific record
   */
  async getRecord(id: number) {
    return await db.trainingRecords.get(id);
  }

  /**
   * Delete a record
   */
  async deleteRecord(id: number) {
    return await db.trainingRecords.delete(id);
  }
}

export const trainingManager = new TrainingManager();
