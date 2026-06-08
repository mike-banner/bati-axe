export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  return {
    r2AccountId: config.r2AccountId,
    r2AccessKeyId: config.r2AccessKeyId,
    r2SecretAccessKey: config.r2SecretAccessKey
  }
})
