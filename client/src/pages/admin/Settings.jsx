export default function Settings() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900">Settings</h1>
      <p className="mt-1 text-sm text-charcoal-500">Platform configuration is managed via environment variables.</p>

      <div className="card mt-6 space-y-3 p-6 text-sm text-charcoal-600">
        <p><span className="font-semibold text-charcoal-800">WhatsApp number:</span> set via VITE_COMPANY_WHATSAPP_NUMBER (client) and COMPANY_WHATSAPP_NUMBER (server)</p>
        <p><span className="font-semibold text-charcoal-800">Company name:</span> set via VITE_COMPANY_NAME</p>
        <p><span className="font-semibold text-charcoal-800">API base URL:</span> set via VITE_API_BASE_URL</p>
        <p><span className="font-semibold text-charcoal-800">AI provider:</span> set AI_PROVIDER=anthropic and ANTHROPIC_API_KEY on the server to use a live model; otherwise the rule-based mock matcher is used automatically.</p>
        <p className="text-xs text-charcoal-400">See the project README for the full .env reference.</p>
      </div>
    </div>
  );
}
