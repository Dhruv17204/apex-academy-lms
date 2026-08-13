import React, { useState, useEffect } from 'react';
import { StudentLayout } from '../../components/layout/StudentLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { CheckCircle2, AlertCircle, User, Mail, Briefcase, GraduationCap, FileText } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { profile, user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [education, setEducation] = useState(profile?.education || '');
  const [experienceLevel, setExperienceLevel] = useState(profile?.experience_level || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
      setBio(profile.bio || '');
      setEducation(profile.education || '');
      setExperienceLevel(profile.experience_level || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const res = await updateProfile({
      full_name: fullName.trim(),
      avatar_url: avatarUrl.trim() || null,
      bio: bio.trim() || null,
      education: education.trim() || null,
      experience_level: experienceLevel.trim() || null,
    });

    setIsSaving(false);

    if (res.success) {
      setSuccessMsg('Profile updated successfully!');
    } else {
      setErrorMsg(res.error || 'Failed to update profile.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Profile Settings</h1>
          <p className="text-xs text-slate-500">
            Manage your personal profile information, credentials, and learning preferences
          </p>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label="Email Address (Verified)"
              value={user?.email || ''}
              disabled
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Highest Education"
              placeholder="e.g. B.Tech in Computer Science"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              icon={<GraduationCap className="w-4 h-4" />}
            />
            <Input
              label="Experience Level"
              placeholder="e.g. Intermediate / 3 Years Software Engineer"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              icon={<Briefcase className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Avatar Image URL (Optional)"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Professional Bio / Statement
            </label>
            <textarea
              rows={3}
              placeholder="Tell instructors and prospective employers about your AI/Tech goals..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              Account Role: <span className="font-bold text-indigo-600">{profile?.role || 'STUDENT'}</span>
            </div>
            <Button variant="primary" type="submit" disabled={isSaving} className="font-bold">
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>
    </StudentLayout>
  );
};
