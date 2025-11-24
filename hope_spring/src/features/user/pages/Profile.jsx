import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext'
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import UserLayout from '../UserLayout';

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Wellness Street, Health City, HC 12345',
    joinDate: 'January 2024',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543'
  });

  // Last saved values (used for Cancel)
  const [savedData, setSavedData] = useState(formData);

  // Per-section edit modes
  const [editing, setEditing] = useState({
    contact: false,
    address: false,
    emergency: false
  });

  const inputClass =
    'w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary';
  const labelClass =
    'flex items-center gap-2 text-xs font-medium text-muted-foreground';
  const buttonPrimary =
    'inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition';
  const buttonOutline =
    'inline-flex items-center rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition';

  const handleSectionSave = (section) => {
    // Persist current formData into savedData for that section
    setSavedData(prev => {
      const next = { ...prev };
      if (section === 'contact') {
        next.name = formData.name;
        next.email = formData.email;
        next.phone = formData.phone;
      } else if (section === 'address') {
        next.address = formData.address;
      } else if (section === 'emergency') {
        next.emergencyContact = formData.emergencyContact;
      }
      return next;
    });

    setEditing(prev => ({ ...prev, [section]: false }));
    toast.success('Profile updated successfully!');
  };

  const handleSectionCancel = (section) => {
    // Revert just that section from savedData
    setFormData(prev => {
      const next = { ...prev };
      if (section === 'contact') {
        next.name = savedData.name;
        next.email = savedData.email;
        next.phone = savedData.phone;
      } else if (section === 'address') {
        next.address = savedData.address;
      } else if (section === 'emergency') {
        next.emergencyContact = savedData.emergencyContact;
      }
      return next;
    });

    setEditing(prev => ({ ...prev, [section]: false }));
  };

  return (
    <UserLayout>
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          My Profile
        </h1>
      </div>

      {/* Main profile card */}
      <div className="rounded-2xl border border-border/50 bg-background shadow-sm">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-primary/10 text-primary text-3xl font-bold flex items-center justify-center">
                {formData.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-8">
              {/* Contact Info Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contact Information
                  </h2>
                  {!editing.contact ? (
                    <button
                      onClick={() => setEditing(prev => ({ ...prev, contact: true }))}
                      className={buttonOutline}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSectionSave('contact')}
                        className={buttonPrimary}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => handleSectionCancel('contact')}
                        className={buttonOutline}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className={labelClass}>
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    {editing.contact ? (
                      <input
                        id="name"
                        className={inputClass}
                        value={formData.name}
                        onChange={e =>
                          setFormData(prev => ({ ...prev, name: e.target.value }))
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">
                        {formData.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className={labelClass}>
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    {editing.contact ? (
                      <input
                        id="email"
                        type="email"
                        className={inputClass}
                        value={formData.email}
                        onChange={e =>
                          setFormData(prev => ({ ...prev, email: e.target.value }))
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">
                        {formData.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className={labelClass}>
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    {editing.contact ? (
                      <input
                        id="phone"
                        className={inputClass}
                        value={formData.phone}
                        onChange={e =>
                          setFormData(prev => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">
                        {formData.phone}
                      </p>
                    )}
                  </div>

                  {/* Join Date (read-only) */}
                  <div className="space-y-2">
                    <span className={labelClass}>
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </span>
                    <p className="text-sm font-medium text-foreground">
                      {formData.joinDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </h2>
                  {!editing.address ? (
                    <button
                      onClick={() => setEditing(prev => ({ ...prev, address: true }))}
                      className={buttonOutline}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSectionSave('address')}
                        className={buttonPrimary}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => handleSectionCancel('address')}
                        className={buttonOutline}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className={labelClass}>
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  {editing.address ? (
                    <input
                      id="address"
                      className={inputClass}
                      value={formData.address}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, address: e.target.value }))
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground">
                      {formData.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Emergency Contact
                  </h2>
                  {!editing.emergency ? (
                    <button
                      onClick={() => setEditing(prev => ({ ...prev, emergency: true }))}
                      className={buttonOutline}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSectionSave('emergency')}
                        className={buttonPrimary}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => handleSectionCancel('emergency')}
                        className={buttonOutline}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="emergency" className={labelClass}>
                    <User className="w-4 h-4" />
                    Emergency Contact
                  </label>
                  {editing.emergency ? (
                    <input
                      id="emergency"
                      className={inputClass}
                      value={formData.emergencyContact}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          emergencyContact: e.target.value
                        }))
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground">
                      {formData.emergencyContact}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Extra info cards (static) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/50 bg-background shadow-sm">
          <div className="px-6 py-4 border-b border-border/40">
            <h2 className="text-base font-semibold text-foreground">
              Health Information
            </h2>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Blood Type</p>
              <p className="font-medium text-foreground">O+</p>
            </div>
            <div>
              <p className="text-muted-foreground">Allergies</p>
              <p className="font-medium text-foreground">None reported</p>
            </div>
            <div>
              <p className="text-muted-foreground">Medical Notes</p>
              <p className="font-medium text-foreground">Regular check-ups scheduled</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-background shadow-sm">
          <div className="px-6 py-4 border-b border-border/40">
            <h2 className="text-base font-semibold text-foreground">
              Program Preferences
            </h2>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Preferred Activities</p>
              <p className="font-medium text-foreground">
                Yoga, Meditation, Art Therapy
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Availability</p>
              <p className="font-medium text-foreground">
                Weekday mornings, Weekend afternoons
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Notification Preferences</p>
              <p className="font-medium text-foreground">
                Email &amp; SMS reminders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </UserLayout>
  );
};

export default Profile;
