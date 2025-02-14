import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Card, Col, Divider, Image, Input, MenuProps, Row } from 'antd';
import { Menu } from 'antd';
import { getRelatedForums } from '@/lib/frontendApi';
import ParaText from '@/app/commonUl/ParaText';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { getForumCategories } from '@/lib/frontendApi';
import './style.css'
import { usePathname } from 'next/navigation'
import AuthContext from '@/contexts/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface Props {
    onCallBack?: any;
    onSearch?: any;
}
interface Category {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface SubCategory {
    _id: string;
    name: string;
    description: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface MenuItem {
    key: string;
    label: string;
    children?: MenuItem[];
}


export default function RightSection({ onCallBack, onSearch }: Props) {
    const { locale, user } = useContext(AuthContext)
    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
    const [relatedData, setRelatedData] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
    const pathname = usePathname()
    const targetUrl = `/${locale}/user/forums`;
    const isTargetMatched = pathname === targetUrl;
    const data = useSelector((state: RootState) => state.forumReducer.data)
    const categoryId = data.categoryId
    const roleName = user?.roleId?.roleName;
    useEffect(() => {
        getRelatedForums(categoryId ? categoryId : 'empty').then((res: any) => {
            setRelatedData(res.data);
        });
        getForumCategories().then((res: any) => {
            setCategories(res.data);
        })
    }, [categoryId]);

    const handleItem = (data: any) => {
        onCallBack(data);
    };

    const items: MenuItem[] = categories.categories?.slice(0, 4).map((category: Category) => {
        const subCategories = categories.subCategories.filter((subCategory: SubCategory) => subCategory.categoryId === category._id);
        return {
            key: category._id,
            label: category.name,
            children: subCategories.slice(0, 5).map((subCategory: any) => ({
                key: subCategory._id,
                label: subCategory.name,
                onClick: () => handleItem(subCategory),
            })),
        };
    })

    const getLevelKeys = (items1: MenuItem[]) => {
        const key: Record<string, number> = {};
        const func = (items2: MenuItem[], level = 1) => {
            items2?.forEach((item) => {
                if (item?.key) {
                    key[item.key] = level;
                }
                if (item?.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    };

    const levelKeys: any = getLevelKeys(items);

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key: any) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    return (
        <>
            <div id='rightSectionForm'>
                {isTargetMatched ? <Card color='#ccc'>
                    {categoryId &&
                        <>
                            <Input placeholder='Search here...' onChange={(e: any) => { onSearch(e.target.value) }} maxLength={50}
                            />
                            <div className="gapPaddingTopOTwo"></div>
                            <ParaText size="small" fontWeightBold={600} color="PrimaryColor">
                                Categories
                            </ParaText>
                            <div className="gapPaddingTopOne"></div>
                            <div className='categoriesMenu'>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['231']}
                                    openKeys={stateOpenKeys}
                                    onOpenChange={onOpenChange}
                                    items={items}
                                />
                            </div>
                            <Divider />
                        </>}
                    {relatedData.relatedForums?.length > 0 && categoryId &&
                        <>
                            <ParaText size="small" fontWeightBold={600} color="PrimaryColor">
                                Related Forums
                            </ParaText>
                            <div className="gapPaddingTopOTwo"></div>
                            <div>
                                <Row gutter={[5, 5]}>
                                    {relatedData.relatedForums?.map((data: any) => {
                                        return (
                                            <>
                                                <Col md={3}>
                                                    {data.attachment ?
                                                        <Image
                                                            src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/original/${data.attachment}`}
                                                            alt="Avatar"
                                                            width="40px"
                                                            height="40px"
                                                            style={{ borderRadius: '50px' }}
                                                            preview={false}
                                                        />
                                                        :
                                                        <Avatar size={40} icon={<UserOutlined />} />
                                                    }
                                                </Col>
                                                <Col md={21}>
                                                    <ParaText size="extraSmall" fontWeightBold={600} color="PrimaryColor">
                                                        <Link target={'blank'} href={`${process.env.NEXT_PUBLIC_SITE_URL}/${roleName}/questions/${data.slug}`} >
                                                            {data.title.length > 65 ? `${data.title.slice(0, 65)}...` : data.title}
                                                        </Link>
                                                    </ParaText>
                                                    <div className='gapPaddingTopOTwo'></div>
                                                </Col>
                                            </>
                                        )
                                    })}
                                </Row>
                            </div>
                            <Divider />
                        </>
                    }

                    {relatedData.others?.length > 0 &&
                        <>
                            <ParaText size="small" fontWeightBold={600} color="PrimaryColor">
                                Other Forums
                            </ParaText>
                            <div className="gapPaddingTopOTwo"></div>
                            <div>
                                {relatedData.others?.map((data: any) => {
                                    return (
                                        <><div className="gapPaddingTopOne"></div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <div>
                                                    {data.attachment ?
                                                        <Image
                                                            src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/original/${data.attachment}`}
                                                            alt="Avatar"
                                                            width="40px"
                                                            height="40px"
                                                            style={{ borderRadius: '50px' }}
                                                            preview={false}
                                                        />
                                                        :
                                                        <Avatar size={40} icon={<UserOutlined />} />
                                                    }
                                                </div>

                                                <div>
                                                    <ParaText size="extraSmall" fontWeightBold={600} color="PrimaryColor">
                                                        <Link target={'blank'} href={`${process.env.NEXT_PUBLIC_SITE_URL}/user/questions/${data.slug}`} >
                                                            {data.title.length > 65 ? `${data.title.slice(0, 65)}...` : data.title}
                                                        </Link>
                                                    </ParaText>
                                                </div>
                                            </div>

                                        </>
                                    )


                                })}
                            </div>
                        </>
                    }
                </Card> : ""}
            </div >
        </>

    );
};


