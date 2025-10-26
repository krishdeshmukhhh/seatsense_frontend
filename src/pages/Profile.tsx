import { UserProfile } from '@clerk/clerk-react';

const Profile = () => {
  return (
    
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mx-auto">
          <UserProfile routing="path" path="/profile" />
        </div>

  );
};

export default Profile;