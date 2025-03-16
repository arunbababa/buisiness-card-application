import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";

const Cards = () => {

  type UserInfo = {
  user_id: string; 
  name: string; 
  description: string; 
  github_id: string; 
  qiita_id: string; 
  x_id: string; 
  created_at: Date;
};

const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  // const [userInfo, setUserInfo] = useState<{ id: string; name: string ; description: string, github_id: string; qiita_id: string; x_id: string; created_at: Date}{}>({});
  useEffect(() => {
      const fetchSkills = async () => {
        const { data, error } = await supabase.from("users").select("*");
        
        if (error) {
          console.error("Error fetching skills:", error);
        } else {
          setUserInfo(data[0] as UserInfo);
        }
      };
  
      fetchSkills();
    }, []);
    
  return (
    <div>
        <div key={userInfo.user_id}>
          <h1>名前:{userInfo.name}</h1>
          <p>{userInfo.description}</p>
          <p>{userInfo.github_id}</p>
          <p>{userInfo.qiita_id}</p>
          <p>{userInfo.x_id}</p>
          <p>{userInfo.created_at?.toString()}</p> 
          {/* // これ調べる */}
        </div>      
    </div>
  );
};

export default Cards;