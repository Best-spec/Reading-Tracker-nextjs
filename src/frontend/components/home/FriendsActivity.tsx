import { FriendActivity } from '@/types/friend'

interface FriendsActivityProps {
  activities: FriendActivity[]
}

export function FriendsActivity({ activities }: FriendsActivityProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Friends Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activity</p>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="text-sm border-l-2 border-blue-500 pl-3 py-1">
              <p className="text-gray-900">
                <span className="font-medium">{activity.username}</span>{' '}
                {activity.description}
              </p>
              <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
