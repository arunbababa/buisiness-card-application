import { Button, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import RegesterHook from '../hooks/Regester';

const Regester = () => {

    const {skills,register,handleSubmit,errors,onSubmit} = RegesterHook()

    return (
        <>
            {/* watchでさらに改善できる */}
            {/* フォーム */}
            <VStack spacing={4} align="stretch" as="form" onSubmit={handleSubmit(onSubmit)}>
                <Text textAlign="center" mb="5px" mt="10px">新規名刺登録</Text>

                {/* ユーザID */}
                <FormControl>
                    <FormLabel>ユーザID</FormLabel>
                    <Input 
                        {...register("user_id", { 
                            required: "ユーザーIDは必須です", 
                            minLength: { value: 2, message: "2文字以上で入力してください"},
                            pattern: { value: /^[A-Za-z]+$/, message: "英字のみで入力してください" }
                            })}
                        placeholder="coffee"
                        data-testid="user-id"
                        aria-invalid={errors.user_id ? "true" : "false"} 
                        />
                    {errors.user_id && <Text color="red.500">{errors.user_id.message}</Text>}
                </FormControl>

                {/* ユーザネーム */}
                <FormControl>
                    <FormLabel>お名前</FormLabel>
                    <Input {...register("user_name", {required: "お名前は必須です", minLength: {value: 2, message: "2文字以上で入力してください"}})} 
                        placeholder="名刺太郎" 
                        data-testid="user-name"
                        aria-invalid={errors.user_name ? "true" : "false"}/>
                    {errors.user_name && <Text color="red.500">{errors.user_name.message}</Text>}
                </FormControl>

                {/* 自己紹介 */}
                <FormControl>
                    <FormLabel>自己紹介</FormLabel>
                    <Input {...register("description", {required: "自己紹介文は必須です", minLength: {value: 10, message: "10文字以上で入力してください"}, maxLength: {value: 100, message: "100文字以内で入力してください"}})} 
                        placeholder="自己紹介文を書いてください" 
                        aria-invalid={errors.description ? "true" : "false"}
                        data-testid="self-introduce"
                        />
                    {errors.description && <Text color="red.500">{errors.description.message}</Text>}
                </FormControl>

                {/* 技術選択 */}
                <Select placeholder='好きな技術を選択してください' {...register("skill", {required: "選択は必須です"})}
                    aria-invalid={errors.skill ? "true" : "false"}
                    >
                    {skills.map((skill, index) => (
                        <option key={index} value={skill.name}>{skill.name}</option>
                    ))}
                </Select>
                {errors.skill && <Text color="red.500">{errors.skill.message}</Text>}

                {/* Github */}
                <FormControl>
                    <FormLabel>GitHub ID</FormLabel>
                    <Input {...register("github_id")} placeholder="GitHubのID" />
                </FormControl>

                {/* Qiita */}
                <FormControl>
                    <FormLabel>Qiita ID</FormLabel>
                    <Input {...register("qiita_id")} placeholder="QiitaのID" />
                </FormControl>

                {/* X */}
                <FormControl>
                    <FormLabel>X ID</FormLabel>
                    <Input {...register("x_id")} placeholder="XのID" />
                </FormControl>

                <Button type="submit" colorScheme="blue">送信</Button>
            </VStack>
        </>
    )
}

export default Regester