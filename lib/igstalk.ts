import axios from 'axios';
import {igstalk} from '../types';
export default function (target: string): Promise<igstalk> {
	return new Promise((resolve, reject) => {
		axios
			.get(`https://www.instagram.com/${target}/?__a=1`, {
				headers: {
					accept:
						'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9,id;q=0.8',
					'cache-control': 'max-age=0',
					'upgrade-insecure-requests': '1',
					cookie:
						'ig_did=BB01A774-7231-4721-87C4-5CBFAD80CCF3; mid=X3hMCwALAAGse8HQ2FDKtXFrjmGq; ig_nrcb=1; fbm_124024574287414=base_domain=.instagram.com; shbid=14122; shbts=1614939844.6190386; rur=PRN; ig_lang=id; csrftoken=Iy4fzIq91R15dxDbe7dln94tQSd32uEM; ds_user_id=46233450911; sessionid=46233450911:B9xoPbEjkovfpt:21; fbsr_124024574287414=g1kmxng_AFk22dMl_9LVgW-04od2ZfGxje1pX4WHV7g.eyJ1c2VyX2lkIjoiMTAwMDA5OTA3MTg0NTU2IiwiY29kZSI6IkFRQ29qRGs4bHFvWnpkT3NJTnZaVk5UVFhWc2FmWGVWdDJDa3E3dU92N2dodGRoU29qU1lBSVl4cUdobVZncXhQeHVBWFFobmhrQmxNWFdmS21lLTROVC01eFFiSVlpazBJOG5LUzRQTUZvRWVacDNkVlJsdjVnRmdkczhsX2NvTVhDZ0NGd19yeTRuM1prRVVWeG04Snh4TkEzUnFhakpHbi1oMDhOWTExZldPWFEzelg3WkhzdTUxQ05ROHBmNjVRZ2txVmp2UEVzbDRBWENIRzdSc2xERDVzSm1GNmttbXFNcnZBc2NuV2c0dWpKWERIZGxBeE4yUGVDdUNsbWc4TGlxUTRsa1NRcEpKRngxZGI2VHIzc3VvQi1aZHAxaXliOThrRTFSSVpLZlBPc1FneGo1aktfcHhwMFE1R1I2dlVleHdpcklGMjBsbjVudTA4eU1HWGVLIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUh4SGZLNGxKZGZNWkJGYkNaQm1PYTBvOGJqdkVDTUNnWkMzVG9hQ3daQnN1RTZRdDVCaGNXM3J6RWFNV0VMRlYxVTR2cENWbWpzRExjaFZlVTlKaEdaQ1RrWVpCSWhaQTk1MkQ1d1RMTXNMNXQ2ZmRYelpBVXBaQjlpS2ZnSFhRUTJGN2ZHWkN2dE9ueWJWUjVYWGVoM0ZkcGtIMXdTdmc3cUJXdGk0dERhSnZoN0YwQnNtZVF0UFFaRCIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjE0OTQ4ODk2fQ',
					'user-agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
				},
			})
			.then(({data}) => {
				const main = data.graphql.user;
				return resolve({
					username: main.username,
					fullname: main.full_name,
					biography: main.biography,
					private: main.is_private,
					imageurl: main.profile_pic_url_hd,
					followers: main.edge_followed_by.count,
					followed: main.edge_follow.count,
					post: main.edge_owner_to_timeline_media.count,
					highlight: main.highlight_reel_count,
				});
			})
			.catch(() => reject('Maaf, username tidak valid'));
	});
}
