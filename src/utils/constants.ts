export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};

export const TESTDATA = {
	items: [
		{
			id: '11',
			title: 'Test item',
			description: 'This is test description',
			category: 'test',
			price: 900,
			image: '',
		},
		{
			id: '12',
			title: 'Test item two',
			description: 'This is test description',
			category: 'test',
			price: 0,
			image: '',
		},
		{
			id: '122',
			title: 'Test item three',
			description: 'This is test description',
			category: 'new test',
			price: 1200,
			image: '',
		},
	],
	total: 2,
};
