import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactMessage {
    id: bigint;
    name: string;
    isRead: boolean;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface Service {
    id: bigint;
    title: string;
    description: string;
    price: bigint;
}
export type ProjectId = bigint;
export interface Project {
    id: ProjectId;
    title: string;
    createdAt: bigint;
    description: string;
    imageUrl: string;
    category: ProjectCategory;
}
export interface UserProfile {
    name: string;
}
export enum ProjectCategory {
    graphicDesign = "graphicDesign",
    uiUx = "uiUx",
    branding = "branding"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addService(title: string, description: string, price: bigint): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(title: string, description: string, category: ProjectCategory, imageUrl: string): Promise<ProjectId>;
    deleteProject(projectId: ProjectId): Promise<void>;
    deleteService(serviceId: bigint): Promise<void>;
    getAllContacts(): Promise<Array<ContactMessage>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(projectId: ProjectId): Promise<Project>;
    getService(serviceId: bigint): Promise<Service>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listProjects(category: ProjectCategory | null): Promise<Array<Project>>;
    listServices(): Promise<Array<Service>>;
    markContactAsRead(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContact(name: string, email: string, message: string): Promise<void>;
    updateProject(projectId: ProjectId, title: string, description: string, category: ProjectCategory, imageUrl: string): Promise<void>;
    updateService(serviceId: bigint, title: string, description: string, price: bigint): Promise<void>;
}
