
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Navigate } from 'react-router-dom';
import { Shield, User, Calendar, Mail, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserData {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  lastLogin: Date;
}

const Admin: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!isAdmin) return;
        
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const userData: UserData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userData.push({
            id: doc.id,
            email: data.email || '',
            displayName: data.displayName || null,
            photoURL: data.photoURL || null,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLogin: data.lastLogin?.toDate() || new Date()
          });
        });
        
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isAdmin && !loading) {
      fetchUsers();
    } else if (!loading) {
      setLoadingUsers(false);
    }
  }, [isAdmin, loading]);

  // If not admin, redirect to home
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/" replace />;
  }

  if (loading || loadingUsers) {
    return (
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-32">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="bg-posh-green p-2 rounded-full mr-3">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="mr-2 h-5 w-5" />
            Registered Users ({users.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((userData) => (
              <Card key={userData.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userData.photoURL || ''} alt={userData.displayName || 'User'} />
                      <AvatarFallback className="bg-posh-green text-white">
                        {userData.displayName?.substring(0, 2) || userData.email?.substring(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{userData.displayName || 'Anonymous'}</CardTitle>
                      <CardDescription className="text-xs flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {userData.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Joined: {format(userData.createdAt, 'PPP')}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Last login: {format(userData.lastLogin, 'PPP')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
