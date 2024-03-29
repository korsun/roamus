declare module '*.module.css'
declare type Dictionary<T> = Record<string, T>
declare module "*.svg" {
	const value: unknown
	export default value
}
