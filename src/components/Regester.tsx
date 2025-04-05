import { Button, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import { Select } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { supabase } from '../utils/API/supabase';
import { useNavigate } from 'react-router';

interface RegisterFormData {
  userID: string;
  userName: string;
  selfIntroduce: string;
  selectSkill: string;
  GitHub_ID: string;
  Qiita_ID: string;
  X_ID: string;
}

const insert_to_supabase = async (user_id: string, name: string, description: string, skill_name: string, github_id: string, qiita_id: string, x_id: string) => {

    const { data: skillData, error: skillError } = await supabase
        .from("skills")
        .select("id")  // 🔹 skill_id を取得
        .eq("name", skill_name); // 🔹 skill_name で検索

    if (skillError || !skillData || skillData.length === 0) {
        return;
    }

    const skillIdNum = skillData[0].id; // 🔹 skill_id を取得

    await supabase.from("users").insert([
        { user_id: user_id, name: name, description: description, github_id: github_id, qiita_id: qiita_id, x_id: x_id },
    ]);
    await supabase.from("user_skill").insert([
        { user_id: user_id, skill_id: skillIdNum }
    ]);
}

const Regester = () => {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors} } = useForm<RegisterFormData>();
    const onSubmit = async(date: RegisterFormData) => {
        await insert_to_supabase(date.userID, date.userName, date.selfIntroduce, date.selectSkill, date.GitHub_ID, date.Qiita_ID, date.X_ID);
        await navigate('/');
    };

    const [skills, setSkills] = useState<{name: string}[]>([]);

    // このfetchskillsとかをAPI処理として切り出すべき
    const fetchSkills = async () => {
            const { data: skills, error } = await supabase.from("skills").select("name");
            if (error) {
                return;
            }
            setSkills(skills);
        }

    // supabaseからスキル一覧を配列としてとってくる
    useEffect(() => {     
        fetchSkills();
},[]);

  return (
    <>
    {/* バリデーション部分はwatchでさらに改善できる */}
        <VStack spacing={4} align="stretch" as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <Text textAlign="center" mb="20px">新規名刺登録</Text>
                <FormLabel>好きな英単語 ※ユーザIDになります</FormLabel>
                <Input 
                    {...register("userID", { 
                        required: "ユーザーIDは必須です", 
                        minLength: { value: 2, message: "2文字以上で入力してください"},
                        pattern: { value: /^[A-Za-z]+$/, message: "英字のみで入力してください" }
                        })}
                    placeholder="coffee"
                    data-testid="user-id"
                    aria-invalid={errors.userID ? "true" : "false"} 
                    />
                {errors.userID && <Text color="red.500">{errors.userID.message}</Text>}
            </FormControl>

            <FormControl>
                <FormLabel>お名前</FormLabel>
                <Input {...register("userName", {required: "お名前は必須です", minLength: {value: 2, message: "2文字以上で入力してください"}})} 
                    placeholder="名刺太郎" 
                    data-testid="user-name"
                    aria-invalid={errors.userName ? "true" : "false"}/>
                {errors.userName && <Text color="red.500">{errors.userName.message}</Text>}
            </FormControl>

            <FormControl>
                <FormLabel>自己紹介</FormLabel>
                <Input {...register("selfIntroduce", {required: "自己紹介文は必須です", minLength: {value: 10, message: "10文字以上で入力してください"}, maxLength: {value: 100, message: "100文字以内で入力してください"}})} 
                    placeholder="自己紹介文を書いてください" 
                    aria-invalid={errors.selfIntroduce ? "true" : "false"}
                    data-testid="self-introduce"
                    />
                {errors.selfIntroduce && <Text color="red.500">{errors.selfIntroduce.message}</Text>}
            </FormControl>

            <Select placeholder='好きな技術を選択してください' {...register("selectSkill", {required: "選択は必須です"})}
                aria-invalid={errors.selectSkill ? "true" : "false"}
                >
                {skills.map((skill, index) => (
                    <option key={index} value={skill.name}>{skill.name}</option>
                ))}
            </Select>
            {errors.selectSkill && <Text color="red.500">{errors.selectSkill.message}</Text>}

            <FormControl>
                <FormLabel>GitHub ID</FormLabel>
                <Input {...register("GitHub_ID")} placeholder="GitHubのID" />
            </FormControl>

            <FormControl>
                <FormLabel>Qiita ID</FormLabel>
                <Input {...register("Qiita_ID")} placeholder="QiitaのID" />
            </FormControl>

            <FormControl>
                <FormLabel>X ID</FormLabel>
                <Input {...register("X_ID")} placeholder="XのID" />
            </FormControl>

            <Button type="submit" colorScheme="blue">送信</Button>
        </VStack>

    </>
  )
}

export default Regester