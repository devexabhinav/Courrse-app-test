"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/store';
import { getUserById, selectCurrentUser, selectUserLoading, selectUserError, updateUserProfile } from "@/store/slices/profile/profileinfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton1";
import { ArrowLeft, Mail, Calendar, User, Shield, CheckCircle, XCircle, Edit, Save, RotateCcw, Upload, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function EditProfilePage({ className }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  
  const userId = getDecryptedItem("userId");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for editable fields
  const [formData, setFormData] = useState({
    username: "",
    bio: ""
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  // Initialize form data when user data is loaded
  useEffect(() => {
    const userData = user?.data || user;
    if (userData) {
      setFormData({
        username: userData.username || "",
        bio: userData.bio || ""
      });
      setProfileImage(userData.profileImage || null);
    }
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsEditing(true);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      setIsEditing(true);
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    // Simulate image upload - replace with your actual upload API
    setImageLoading(true);
    try {
      // This is where you would call your file upload API
      // For example: const response = await reduxApiClient.postFile('upload/profile-image', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return the uploaded image URL
      // In real implementation, this would come from your API response
      const mockImageUrl = `https://example.com/profiles/${Date.now()}_${file.name}`;
      return mockImageUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    
    setSaveLoading(true);
    try {
      const updates: any = { ...formData };

      // Upload new profile image if selected
      if (selectedFile) {
        const imageUrl = await uploadProfileImage(selectedFile);
        updates.profileImage = imageUrl;
      }

      await dispatch(updateUserProfile({
        userId,
        updates
      })).unwrap();
      
      setIsEditing(false);
      setSelectedFile(null);
      // Optionally refetch user data
      dispatch(getUserById(userId));
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleReset = () => {
    const userData = user?.data || user;
    setFormData({
      username: userData?.username || "",
      bio: userData?.bio || ""
    });
    setProfileImage(userData?.profileImage || null);
    setSelectedFile(null);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'super-admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'user': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get user data from response
  const userData = user?.data || user;

  if (loading) {
    return (
      <div className={cn("p-6 max-w-4xl mx-auto", className)}>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-6 max-w-4xl mx-auto", className)}>
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <XCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading User</h3>
              <p>{error}</p>
              <Button 
                onClick={() => userId && dispatch(getUserById(userId))}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={cn("p-6 max-w-4xl mx-auto", className)}>
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">User Not Found</h3>
            <p className="text-gray-600">The requested user could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("p-6 max-w-4xl mx-auto", className)}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header with Back Button and Save */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Button>
        
        <div className="flex items-center gap-3">
          {isEditing && (
            <Button 
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          )}
          <Button 
            onClick={handleSave}
            disabled={(!isEditing && !selectedFile) || saveLoading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saveLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Profile Image in Circle - Clickable for Upload */}
              <div className="relative group">
                <div 
                  className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center cursor-pointer transition-all duration-200 group-hover:opacity-80"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt={`${userData.username}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {userData.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Upload Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Upload Indicator */}
                {imageLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                
                {/* Online Status Indicator */}
                {userData.status === 'active' && (
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
                
                {/* New Image Badge */}
                {selectedFile && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="text-2xl font-bold max-w-md"
                    placeholder="Enter your username"
                  />
                </div>
                
                <CardDescription className="flex items-center gap-2 text-lg">
                  <Mail className="w-4 h-4" />
                  {userData.email}
                </CardDescription>
                
                {/* Upload Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImageClick}
                  className="mt-3 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(userData.status)}>
                {userData.status?.charAt(0).toUpperCase() + userData.status?.slice(1)}
              </Badge>
              <Badge className={getRoleColor(userData.role)}>
                {userData.role?.charAt(0).toUpperCase() + userData.role?.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Bio Section - Editable */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              About
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
              <Textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[120px] resize-none border-0 bg-transparent focus:ring-0 text-gray-700 dark:text-gray-300 leading-relaxed"
                rows={4}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* User Details Grid - Read Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Account Details
              </h4>
              
              <div className="space-y-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Role:</span>
                  <Badge variant="secondary" className={getRoleColor(userData.role)}>
                    {userData.role}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge variant="secondary" className={getStatusColor(userData.status)}>
                    {userData.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Verified:</span>
                  <div className="flex items-center gap-2">
                    {userData.verified ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Account Timeline
              </h4>
              
              <div className="space-y-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Last updated:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    #{userData.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* File Info */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-800">New profile picture selected</p>
                  <p className="text-sm text-blue-600">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setProfileImage(userData.profileImage || null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          {/* Save Button at Bottom */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button 
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saveLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saveLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}