'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { GetPackageEssayById, updatePackageEssay } from '@/lib/commonApi';
import { SubmitEssay } from '@/lib/types';
import { Form, message } from 'antd';
import ErrorHandler from '@/lib/ErrorHandler';
import { useRouter } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';

export default function StudentEssaySubmmited() {
    const { user } = useContext(AuthContext);
    const searchParams = useSearchParams();
    const essayId = searchParams.get('EssayId');
    const [essay, setEssay] = useState<SubmitEssay | null>(null);
    const [form] = Form.useForm();
    const router = useRouter();

    const fetchSubmitPackageData = async () => {
        const response = await GetPackageEssayById(essayId);
        console.log(response, "GetPackageEssayById")
        if (response) {
            setEssay(response.data);
        }
    };

    useEffect(() => {
        fetchSubmitPackageData();
    }, [essayId]);

    const onFinish = async (values: SubmitEssay) => {
        try {
            const data = {
                essayId,
                comment: values.comment,
                userId: user?._id,
                updatedBy: user?._id,
            };
            const res = await updatePackageEssay(essayId, data);
            if (res.status === true) {
                message.success(res.message);
                { user?.roleId?.roleName == 'admin' ? router.push('/admin/submittedPackageEssay') : router.push('/student/myEssay'); }

            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    // Check if admin has replied by looking for a comment from an admin
    const hasAdminReplied = essay?.comments?.some((comment: { userId: string | null | undefined; }) => comment.userId !== user?._id);

    // Extract admin's name
    const adminName = essay?.comments?.find((comment: { userId: string | null | undefined; }) => comment.userId !== user?._id)?.userId?.name || 'Admin';

    console.log(essay, 'essayData');


    return (
        <>
            <section className="dash-part bg-light-steel ">
                <div className="spac-dash">
                    <h2 className='top-title'>Essay Name : {essay?.packageEssayId?.essayName}</h2><br />
                    (Submitted Date: {essay?.createdAt ? new Intl.DateTimeFormat('en-GB').format(new Date(essay?.createdAt)) : 'N/A'})
                    <Form form={form} onFinish={onFinish} layout="vertical" size='large' initialValues={{
                        comment: '',
                    }}>

                        <div className="card-dash mt-3">
                            <div className="form-panel mt-3">
                                <textarea
                                    className="field-panel size-xxl"
                                    defaultValue={essay?.description || ""}
                                    disabled
                                />
                                <h3 className="title-tertiary color-dark-gray top-ultra-space bottom-extra-space">
                                    Comments by Admin ({adminName}):
                                </h3>

                                {essay?.comments?.map((item: SubmitEssay) => (
                                    <div key={item._id} className="comment-panel">
                                        <textarea
                                            className="field-panel size-xl top-ultra-space"
                                            defaultValue={item.comment || ""}
                                            disabled
                                        />
                                        <p style={{ textAlign: item.userId === user?._id ? 'right' : 'left' }} className="color-gray">
                                            {/* Check roles and ownership */}
                                            {item.userId === user?._id
                                                ? 'Commented by Me' // Logged-in user's own comment
                                                : user?.isAdmin
                                                    ? 'Commented by Student' // Admin viewing a student's comment
                                                    : 'Commented by Admin' // Student viewing an admin's comment
                                            }
                                        </p>
                                    </div>
                                ))}

                                {/* Render comment field only if admin has replied */}
                                {user?.isAdmin || hasAdminReplied ? (
                                    <Form.Item
                                        name="comment"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter a comment before submitting!',
                                            }, {
                                                validator: (_, value) => {
                                                    if (!value || value.trim().length === 0) {
                                                        return Promise.reject(new Error("Comment cannot be empty or just spaces!"));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <textarea
                                            className="field-panel size-xl top-ultra-space"
                                            placeholder="Add your comment"
                                        />
                                    </Form.Item>
                                ) : (
                                    <p className="color-gray">You cannot add a comment until the admin replies.</p>
                                )}

                                <button
                                    type='submit'
                                    className="btn-primary fix-content-width btn-spac top-ultra-space"
                                    disabled={!user?.isAdmin && !hasAdminReplied}
                                >
                                    Post a Comment
                                </button>

                            </div>
                        </div>
                    </Form>
                </div>
            </section>
        </>
    )
}
