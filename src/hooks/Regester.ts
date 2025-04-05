import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { supabase } from '../API/supabase';
import { useForm } from 'react-hook-form';
import FormData from '../types/FormData'

const RegesterHook = () => {
    const [skills, setSkills] = useState<{name: string}[]>([]);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors} } = useForm<FormData>();
    const onSubmit = async(data: FormData) => {
        console.log(data)
        await insert_to_supabase(data);
        await navigate('/');
    };

    const fetchSkills = async () => {
        const { data: skills, error } = await supabase.from("skills").select("name");
        if (error) {
            return;
        }
        setSkills(skills);
    }

    const insert_to_supabase = async (FormData:FormData) => {
        const {user_id,user_name,description,skill,github_id,qiita_id,x_id} = FormData
        const { data: skillData, error: skillError } = await supabase
            .from("skills")
            .select("id")
            .eq("name", skill);
        if (skillError || !skillData || skillData.length === 0) {
            return;
        }
        const skillIdNum = skillData[0].id;
        await supabase.from("users").insert([
            { user_id: user_id, name: user_name, description: description, github_id: github_id, qiita_id: qiita_id, x_id: x_id }, // user_nameのカラム名をsupabase側で変更しuser_nameにする TODO
        ]);
        await supabase.from("user_skill").insert([
            { user_id: user_id, skill_id: skillIdNum }
        ]);
    }

    // supabaseからスキル一覧を配列としてとってくる
    useEffect(() => {     
        fetchSkills();
    },[]);
    return {
        skills,register,handleSubmit,errors,onSubmit
    }
}

export default RegesterHook