import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import UserInfo from '../types/UserInfo'
import { Icon } from '@chakra-ui/react';
import { supabase } from '../API/supabase';

const CardsHook = () => {

    const [loading, setLoading] = useState(true);
    const params_id = useParams()
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const navigate = useNavigate();
    const navigateToHome = () => navigate("/");

    useEffect(() => {
        const fetchSkills = async () => {
            const { data: skillIdData, error: skillIdError } = await supabase
                .from("user_skill")
                .select("skill_id")
                .eq("user_id", params_id.id);
            if (skillIdError) {
            return;
            }
            const skill_id = skillIdData[0].skill_id;

            const { data: skillData, error: skillError } = await supabase
                .from("skills")
                .select("name")
                .eq("id", skill_id);
                if (skillError) {
                return;
                }
            const skill_name = skillData[0].name;

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("user_id", params_id.id);
                if (userError) {
                return;
                }
                setUserInfo({
                user_id: userData[0].user_id,
                user_name: userData[0].name,
                description: userData[0].description,
                skill: skill_name,
                github_id: userData[0].github_id,
                qiita_id: userData[0].qiita_id,
                x_id: userData[0].x_id,
                });
        }
        fetchSkills();
        setLoading(false);
        }, [params_id]);

    return {
        userInfo,navigateToHome,loading, Icon
    }
}

export default CardsHook