package backend.service;

import backend.entity.SiteUser;
import backend.entity.SiteUserRequestDto;
import backend.entity.SiteUserResponseDto;
import backend.entity.SiteUserRole;
import backend.repository.SiteUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SiteUserService implements UserDetailsService {
    private final SiteUserRepository siteUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void createSiteUser(SiteUserRequestDto siteUserRequestDto) {
        if(siteUserRepository.existsByUsername(siteUserRequestDto.getUsername()))
        {
            throw new IllegalArgumentException("이미 등록된 사용자 ID입니다.");
        }
        if(siteUserRepository.existsByEmail(siteUserRequestDto.getEmail()))
        {
            throw new IllegalArgumentException("이미 등록된 이메일입니다.");
        }
        SiteUser siteUser = new SiteUser();
        siteUser.setUsername(siteUserRequestDto.getUsername());
        siteUser.setPassword(passwordEncoder.encode(siteUserRequestDto.getPassword()));
        siteUser.setEmail(siteUserRequestDto.getEmail());
        siteUserRepository.save(siteUser);
    }

    public SiteUser getSiteUserById(Long id) {
        Optional<SiteUser> siteUser = siteUserRepository.findById(id);
        if(siteUser.isPresent()) {
            return siteUser.get();
        } else {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }
    }

    public SiteUser getSiteUserByUsername(String username) {
        Optional<SiteUser> siteUser = siteUserRepository.findByUsername(username);
        if(siteUser.isPresent()) {
            return siteUser.get();
        } else {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }
    }

    public SiteUserResponseDto getSiteUserDtoByUsername(String username) {
        return siteUserRepository.getSiteUserDtoByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<SiteUser> _siteUser = siteUserRepository.findByUsername(username);
        if(_siteUser.isEmpty()) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }
        SiteUser siteUser = _siteUser.get();
        List<GrantedAuthority> authorities = new ArrayList<>();
        if("admin".equals(username)) {
            authorities.add(new SimpleGrantedAuthority(SiteUserRole.ADMIN.getValue()));
        } else {
            authorities.add(new SimpleGrantedAuthority(SiteUserRole.USER.getValue()));
        }
        return new User(siteUser.getUsername(), siteUser.getPassword(), authorities);
    }
}
