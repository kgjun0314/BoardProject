package backend;

import backend.entity.Post;
import backend.entity.SiteUser;
import backend.repository.PostRepository;
import backend.repository.SiteUserRepository;
import backend.service.PostService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private PostRepository postRepository;
	@Autowired
	private SiteUserRepository siteUserRepository;

	@Test
	void testJpa() {
		SiteUser siteUser = new SiteUser();
		siteUser.setUsername("ㅇㅇ");
		siteUser.setPassword("123");
		siteUser.setEmail("123@gmail.com");
		siteUserRepository.save(siteUser);

		for(int i = 1; i <= 300; i++){
			String subject = String.format("테스트 데이터입니다:[%03d]", i);
			String content = "내용무";
			Post post = createPost(subject, content, siteUser);
			postRepository.save(post);
		}
	}

	private Post createPost(String title, String content, SiteUser siteUser) {
		Post post = new Post();
		post.setTitle(title);
		post.setContent(content);
		post.setSiteUser(siteUser);
		post.setCreatedDate(LocalDateTime.now());
		return post;
	}

}
