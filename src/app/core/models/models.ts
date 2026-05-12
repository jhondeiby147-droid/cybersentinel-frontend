// --- USUARIOS ---
export interface UserBase {
    username: string;
    role: string;
}

export interface UserResponse extends UserBase {
    id: number;
}

// Para el RF-08 (CRUD)
export interface UserUpdate {
    password?: string;
    role?: string;
}

// --- ANÁLISIS DE IA ---
export interface Entity {
    entity: string;
    category: string;
    start: number; // Corregido de int a number
    end: number;
}

export interface AnalysisResponse {
    severity: string;
    confidence_score: number;
    entities: Entity[];
    summary: string;
}

// --- AUDITORÍA (RF-07) ---
export interface AuditLogResponse {
    id: number;
    username: string;
    original_text: string;
    severity: string;
    confidence_score: number;
    entities_json: string;
    summary: string;
    timestamp: string; // ISO Date string
}

// --- DASHBOARD (RF-06) ---
export interface SeverityCount {
    Baja: number;
    Media: number;
    Alta: number;
    Critica: number;
}

export interface DashboardStats {
    total_scans: number;
    average_confidence: number;
    severity_distribution: SeverityCount;
}