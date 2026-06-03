import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { formatPhone } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Admin — SLP Specialist Directory',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const supabase = await createServiceClient()

  const [
    { count: pendingCount },
    { data: pendingListings },
    { count: totalCount },
    { count: claimedCount },
    { count: paidCount },
  ] = await Promise.all([
    supabase.from('slp_listings').select('*', { count: 'exact', head: true }).eq('is_approved', false).eq('is_active', true),
    supabase.from('slp_listings').select('*').eq('is_approved', false).eq('is_active', true).order('created_at', { ascending: false }).limit(50),
    supabase.from('slp_listings').select('*', { count: 'exact', head: true }).eq('is_approved', true),
    supabase.from('slp_listings').select('*', { count: 'exact', head: true }).eq('is_claimed', true),
    supabase.from('slp_listings').select('*', { count: 'exact', head: true }).in('listing_tier', ['verified', 'featured']),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-slate mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total SLPs" value={totalCount ?? 0} />
        <StatCard label="Claimed" value={claimedCount ?? 0} />
        <StatCard label="Paid (Verified+)" value={paidCount ?? 0} color="emerald" />
        <StatCard label="Pending Review" value={pendingCount ?? 0} color="amber" />
      </div>

      {/* Pending approvals */}
      <div>
        <h2 className="text-xl font-bold text-brand-slate mb-4">
          Pending Approval ({pendingCount ?? 0})
        </h2>

        {!pendingListings?.length ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
            <p>No listings pending approval. ✅</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {listing.full_name}
                      {listing.credentials && <span className="text-gray-500 font-normal">, {listing.credentials}</span>}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {listing.city}, {listing.state}
                      {listing.phone ? ` · ${formatPhone(listing.phone)}` : ''}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted {new Date(listing.created_at).toLocaleDateString()}
                      {listing.email ? ` · ${listing.email}` : ''}
                      {listing.npi_number ? ` · NPI: ${listing.npi_number}` : ''}
                    </p>
                    {listing.specialties && listing.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {listing.specialties.map((s: string) => (
                          <span key={s} className="badge-specialty text-xs">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <form action="/api/admin/approve" method="post">
                      <input type="hidden" name="listing_id" value={listing.id} />
                      <button type="submit" className="px-4 py-2 bg-brand-emerald text-white text-sm font-semibold rounded-lg hover:bg-brand-emerald-dark transition-colors">
                        Approve
                      </button>
                    </form>
                    <form action="/api/admin/reject" method="post">
                      <input type="hidden" name="listing_id" value={listing.id} />
                      <button type="submit" className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition-colors">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color?: 'emerald' | 'amber' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
      <div className={`text-3xl font-extrabold mb-1 ${
        color === 'emerald' ? 'text-brand-emerald' : color === 'amber' ? 'text-brand-amber' : 'text-brand-slate'
      }`}>
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}
